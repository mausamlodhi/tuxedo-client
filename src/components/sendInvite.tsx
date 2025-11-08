"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EventParticipantInterface } from "@/app/event-details/page";

interface SendInviteProps {
  handlePrevious: () => void;
  handleNext: () => void;
  getParticipantsStatus?: () => void;
  participants?: EventParticipantInterface[];
  referenceId?:string;
  emails:string;
  setEmails:any;
  handleSendInvitation:()=> void;
  sendingEmail:boolean
}

const SendInvite: React.FC<SendInviteProps> = ({ 
  handleNext, 
  handlePrevious, 
  getParticipantsStatus,
  participants,
  referenceId,
  emails,
  setEmails,
  handleSendInvitation,
  sendingEmail
}) => {
  const [inviteLink] = useState(`https://vipformalwear.com.dj/${referenceId}`);
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Failed to copy link.");
    }
  };

  const sendTextLink = () => alert("Text link sent to your phone (demo action).");

  const sendEmailLinks = () => {
    if (!emails.trim()) return alert("Please enter at least one email.");
    alert(`Invite links sent to: ${emails}`);
    setEmails("");
  };

  const members = [
    { name: "John Doe", signedUp: true, fit: false, checkout: false, shipped: false },
    { name: "Peter Parker", signedUp: true, fit: true, checkout: false, shipped: false },
    { name: "Mark Lee", signedUp: true, fit: false, checkout: true, shipped: false },
  ];

  useEffect(()=>{
    getParticipantsStatus && getParticipantsStatus();
  },[]);

  return (
    <>
      {/* Navigation Buttons */}
      <div className="flex items-center justify-end gap-4 mt-10 px-6">
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer font-advent font-medium transition-all"
        >
          <ArrowLeft size={18} />
          Previous
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-5 py-2 h-[45px] min-w-[160px] bg-[#e7c0a1] text-white cursor-pointer font-advent font-medium hover:bg-[#d1a989] transition-all"
        >
          Next
          <ArrowRight size={18} />
        </motion.button>
      </div>

      <div className="flex flex-col lg:flex-row justify-center py-10 px-6 bg-white text-gray-800">
        <motion.div
          className="p-8 w-full lg:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold mb-1 font-advent">Send Invite</h2>
          <p className="text-sm text-gray-600 mb-6 font-advent">
            Invite members so they can sign up, get fit, and checkout.
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 font-advent">Text or email this link:</h3>
            <div className="flex">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 border font-advent border-gray-300 px-3 py-2 text-sm bg-white rounded-l-md outline-none"
              />
              <motion.button
                onClick={copyToClipboard}
                className="bg-[#d1a989] text-white cursor-pointer font-advent px-4 py-2 text-sm w-[160px] h-[45px] font-medium "
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copied ? "Copied!" : "Copy Link"}
              </motion.button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2 font-advent">Or, let us send the link</h3>
            <motion.button
              onClick={sendTextLink}
              className="border border-gray-800 px-4 py-2 text-sm font-medium hover:bg-gray-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Text Link To Myself
            </motion.button>
            <p className="text-xs text-gray-500 mt-1 font-advent">
              *By clicking the text link, you are opting into SMS communication.
            </p>
          </div>

          {/* Email Link */}
          <div>
            <h3 className="font-semibold mb-2 font-advent">Email link to your members</h3>
            <p className="text-xs text-gray-600 mb-2 font-advent">
              Enter your member’s email addresses below and we’ll send an invite link right away.
            </p>
            <textarea
              placeholder="example1@gmail.com, example2@gmail.com"
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              className="w-full border font-advent border-gray-300 p-3 text-sm h-24 resize-none focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <motion.button
              onClick={()=>{
                if(emails?.length){
                  handleSendInvitation()
                }
              }}
              disabled={sendingEmail}
              className="mt-4 bg-[#2D333C] disabled:cursor-not-allowed font-advent text-white px-5 py-2 text-sm hover:bg-black transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Links
            </motion.button>
          </div>
        </motion.div>

        {/* Right - Member Status */}
        <motion.div
          className="border border-gray-200 p-8 w-full lg:w-1/2 rounded-md overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold mb-4 font-advent">Member Status</h2>
          <table className="min-w-full text-md border border-gray-200 rounded-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-2 px-3 text-left font-semibold">Member Name</th>
                 <th className="py-2 px-3 text-center font-semibold">Invitation sent</th>
                <th className="py-2 px-3 text-center font-semibold">Signed Up</th>
                <th className="py-2 px-3 text-center font-semibold">Fit</th>
                <th className="py-2 px-3 text-center font-semibold">Checkout</th>
                {/* <th className="py-2 px-3 text-center font-semibold">Shipped</th> */}
              </tr>
            </thead>
            <tbody className="text-center">
              {participants.map((m, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="py-2 px-3 text-left text-md">{m.firstName} {m.lastName}</td>

                  {/* {[m.isSignedUp, m.isFit, m.isCheckout, m.isShipped].map((status, j) => ( */}
                    {[m.isInvited, m.isSignedUp, m.isFit, m.isCheckout].map((status, j) => (

                    <td key={j} className="py-2 px-3">
                      <div className="flex justify-center items-center">
                        <div
                          className={`h-5 w-5 rounded-md flex items-center justify-center text-[12px] font-bold transition-all duration-200 
                ${status ? "bg-[#e7c0a1] text-white border border-[#e7c0a1]" : "bg-gray-400 text-white border border-gray-300"}`}
                        >
                          {status ? "✔" : "✖"}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

          </table>
        </motion.div>
      </div>
    </>
  );
};

export default SendInvite;
