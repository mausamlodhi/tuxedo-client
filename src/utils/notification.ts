import toastr from "toastr";

type NotificationType = "info" | "success" | "error" | "warning";

interface ModalNotificationProps {
  type: NotificationType;
  message: string;
}

const modalNotification = ({ type, message }: ModalNotificationProps): void => {
  const iconMap: Record<NotificationType, string> = {
    info: "ni ni-info-fill",
    success: "ni ni-check-circle-fill",
    error: "ni ni-cross-circle-fill",
    warning: "ni ni-alert-fill",
  };

  const msg = `
    <span class="toastr-icon"><em class="icon ${iconMap[type]}"></em></span>
    <div class="toastr-text">${message}</div>
  `;

  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: "toast-top-right",
    closeHtml: '<span class="btn-trigger">&#10006;</span>',
    preventDuplicates: true,
    showDuration: 250,
    hideDuration: 250,
    timeOut: 2000,
    extendedTimeOut: 5000,
    tapToDismiss: false,
  };

  
  const $toast = toastr[type](msg);

 
  if ($toast && $toast.length > 0) {
    const toastElement = $toast[0] as HTMLElement; 
    const closeButton = toastElement.querySelector(".btn-trigger");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        toastr.clear($toast); 
      });
    }
  }
};

export default modalNotification;
