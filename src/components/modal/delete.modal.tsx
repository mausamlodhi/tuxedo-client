import logger from "@/utils/logger";
import { AlertTriangle, Trash2, X } from "lucide-react";

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    theme,
    isLoading = false,
    deleteMessage = "",
    confirmMessage = ""
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleConfirm = (): void => {
        onConfirm();
    };

    return (
        <div
            className={`fixed inset-0 ${theme ? "bg-[#0000000F]/40" : "bg-black/40"} backdrop-blur-md flex items-center justify-center p-4 z-50`}
            onClick={handleBackdropClick}
        >

            <div className={`rounded-2xl shadow-2xl border w-full max-w-md transform transition-all duration-300 scale-100 ${theme ? "bg-white border-[#0000000F] text-[#00000]" : "bg-[#313A46] border-slate-600 text-white"}`}>
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${theme?"border-[#0000000F]":"border-slate-600"}`}>
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-red-200 bg-opacity-20 rounded-full flex items-center justify-center">
                            <AlertTriangle size={20} className="text-red-400" />
                        </div>
                        <h2 className={`text-xl font-semibol`}>Confirm Delete</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className={`text-slate-400 cursor-pointer ${theme?"hover:bg-[#0000000F]":"hover:text-white hover:bg-slate-600"} transition-colors duration-200 p-1 rounded-lg`}
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="text-center mb-6">
                        {/* Warning Icon */}
                        <div className="mx-auto w-16 h-16 bg-red-200 bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                            <Trash2 size={32} className="text-red-400" />
                        </div>

                        {/* Warning Message */}
                        <h3 className="text-lg font-mediummb-2">
                            Are you sure you want to delete this ?
                        </h3>
                        <p className="text-slate-300 text-sm mb-4">
                            You are about to permanently delete{' '}
                            {/* <span className="font-semibold text-white">"{itemName}"</span>. */}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-slate-600 cursor-pointer hover:bg-slate-500 text-white font-medium rounded-xl transition-all duration-200 border border-slate-500 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 bg-red-500 cursor-pointer hover:bg-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Deleting...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    <Trash2 size={16} className="mr-2" />
                                    Delete
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;