"use client";

import React, { useEffect, useState } from "react";
import FooterLookBuilder from "@/components/footerLookBuild";
import AddOutfitAndMemberComponent from "@/components/addOutfit";
import SendInvite from "@/components/sendInvite";
import CheckoutSection from "@/components/checkoutComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectEventData,
  selectUserData,
  setActiveSidebar,
  updateEventData,
} from "../redux/slice/auth.slice";
import { formatDate, generateRandomCode, getLayerData, groupByCategory } from "@/utils";
import logger from "@/utils/logger";
import { hangerLayer } from "@/hooks/useLayers";
import { useRouter, useSearchParams } from "next/navigation";
import { updateAllLayerInCategory } from "../redux/slice/look-builder.slice";
import { outfitServices } from "@/servivces/user/outfit.service";
import modalNotification from "@/utils/notification";
import SidebarForm from "@/components/addEditOutfit";
import { UserAuthServices } from "@/servivces/user/auth.service";
import FitConfirmation from "@/components/fitConfirmation";
import BodyMeasurementsForm from "@/components/forms/bodyMeasurementsForm";
import { motion } from "framer-motion";
import { MapPin, Ruler, ArrowLeft, ArrowRight } from "lucide-react";
import MeasurementComponent from "@/components/forms/measurementComponent";
import { EventDetailsServices } from "@/servivces/user/eventDetails.service";

interface Outfit {
  id: number;
  name: string;
  role: string;
  price: number;
  image: string;
  fabricSample: string;
}

export interface EventParticipantInterface {
  firstName?: string;
  lastName?: string;
  id?: number;
  isInvited?: boolean;
  isSignedUp?: boolean;
  isFit?: boolean;
  isCheckout?: boolean;
  isShipped?: boolean;
  email?: string;
}

const EventDetail: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const eventData = useSelector(selectEventData);
  const [selectedTab, setSelectedTab] = useState<string>("addOutfit");
  const [outfits, setOutfits] = useState(eventData?.outfits || []);
  const [eventOutfitLayers, setEventOutfitLayers] = useState([]);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [duplicateOutfitId, setDuplicateOutfitId] = useState<number | null>(
    null
  );
  const [participants, setParticipants] = useState<EventParticipantInterface[]>(
    []
  );
  const [isOrderPlaced, setIsOrderPlaced] = useState<boolean>(false);
  const priceType = searchParams.get("price_type");
  const [referenceId, setReferenceId] = useState<string>("");
  const [emails, setEmails] = useState("");
  const [orderId, setOrderId] = useState<string>("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showMeasurementForm, setShowMeasurementForm] = useState<boolean>(false);
  const [measurementData, setMeasurementData] = useState<any>(null);
  const [measurmentType, setMeasurementType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const getOutfitLayers = async () => {
    try {
      const allLayers: any[] = [];
      for (const event of outfits) {
        const layerData = await getLayerData(event);
        const singleLayerData = Object.values(layerData).flat();
        singleLayerData.push(hangerLayer);
        allLayers.push(singleLayerData);
      }
      setEventOutfitLayers(allLayers);
    } catch (error) {
      console.error("Error fetching outfit layers:", error);
    }
  };

  const editOutfit = async (data: any, index: number) => {
    try {
      const outfitData = await groupByCategory(data);
      dispatch(updateAllLayerInCategory(outfitData as any));
      router.push(
        `/look-builder?price_type=${priceType}&outfit=${index}&type=edit`
      );
    } catch (error) {
      logger("Error editing outfit:", error);
    }
  };

  const duplicateOutfit = (id: number) => {
    setIsEditOpen(true);
    setDuplicateOutfitId(id);
  };

  const deleteOutfit = async (id: number) => {
    const response = await outfitServices.deleteOutfit(id);
    if (response.status) {
      modalNotification({
        type: "success",
        message: "Outfit deleted successfully",
      });
      const updatedOutfits = outfits.filter((o) => o.id !== id);
      setOutfits(updatedOutfits);
      const updatedEventData = {
        ...eventData,
        outfits: updatedOutfits,
      };
      dispatch(updateEventData(updatedEventData));
    }
  };

  const handleAddDuplicateOutfit = async (data: any) => {
    try {
      const bodyData = {
        ...data,
        eventId: eventData?.id,
        coatId: eventData.outfits?.[duplicateOutfitId]?.coatId,
        pantId: eventData.outfits?.[duplicateOutfitId]?.pantId,
        shirtId: eventData.outfits?.[duplicateOutfitId]?.shirtId,
        tieId: eventData.outfits?.[duplicateOutfitId]?.tieId,
        vestId: eventData.outfits?.[duplicateOutfitId]?.vestId,
        shoeId: eventData.outfits?.[duplicateOutfitId]?.shoeId,
        socksId: eventData.outfits?.[duplicateOutfitId]?.socksId,
        jewelId: eventData.outfits?.[duplicateOutfitId]?.jewelId,
        suspendersId: eventData.outfits?.[duplicateOutfitId]?.suspendersId,
        pocket_squareId:
          eventData.outfits?.[duplicateOutfitId]?.pocket_squareId,
        totalAmount: eventData.outfits?.[duplicateOutfitId]?.totalAmount,
      };
      const response = await outfitServices.createOutfit(bodyData);
      if (response.status) {
        const updatedEventData = {
          ...eventData,
          outfits: [...eventData?.outfits, response.result],
        };
        setOutfits((prev) => [...prev, response.result]);
        dispatch(updateEventData(updatedEventData));
        modalNotification({
          type: "success",
          message: "Outfit duplicated successfully",
        });
      }
    } catch (error) {
      logger("Error duplicating outfit:", error);
    }
    setIsEditOpen(false);
    setDuplicateOutfitId(null);
  };

  const addOutfit = async () => {
    router.push(`/look-builder?type=add&price_type=${priceType}`);
  };

  const getParticipantsStatus = async () => {
    try {
      const customerData = eventData?.outfits.map((outfit: any) => {
        return {
          outfitId: outfit?.id,
          firstName: outfit?.firstName,
          lastName: outfit?.lastName,
        };
      });
      const response = await UserAuthServices.handleGetCustomerStatus({
        customerData: customerData,
      });
      if (response.status) {
        const updatedOutfits = eventData?.outfits.map(
          (outfit: any, idx: number) => {
            return {
              firstName: outfit?.firstName,
              lastName: outfit?.lastName,
              id: outfit?.id,
              isSignedUp: response?.data?.[idx]?.firstName ? true : false,
              isFit: false,
              isCheckout: response?.data?.[idx]?.outfit?.id ? true : false,
              isInvited: response?.data?.[idx]?.isInvited || false,
              isShipped: false,
              email: outfit?.email,
            };
          }
        );
        setParticipants(updatedOutfits);
        getParticipantsEmails(updatedOutfits);
      }
    } catch (error) {
      logger("Error fetching customer status: ", error);
    }
  };

  const placedOrder = async (data: any) => {
    try {
      const orderData = {
        userId: userData?.id,
        outfitId: eventData?.outfits?.[0]?.id,
        eventId: eventData?.id,
        store: data?.store || "",
        status: "Pending",
        deliveryDate: eventData?.eventDate || "",
        totalAmount: eventData?.outfits?.[0]?.totalAmount,
        address: data?.street || "",
        city: data?.city || "",
        state: data?.state || "",
        zipcode: data?.zipcode || "",
        phone: data?.phone || "",
        isCheckout: true,
        referenceId,
        customerName: `${eventData?.firstName} ${eventData?.lastName}`,
        email: userData?.email,
        measurementProvinience: measurmentType
      };
      const response = await UserAuthServices.handleCreateOrder(orderData);
      if (response?.status) {
        setOrderId(response?.data?.id);
        setIsOrderPlaced(true)
        dispatch(updateEventData({}));
      }
    } catch (error) {
      logger("error while placing an order : ", error);
    }
  };
  const handleSendInvitation = async () => {
    setSendingEmail(true);
    const bodyData = {
      eventId: eventData?.id,
      eventName: eventData?.eventName,
      referenceId,
      emailData: emails,
    };
    const response = await UserAuthServices.sendEventInvitation(bodyData);
    if (response?.status) {
      modalNotification({
        type: "success",
        message: "Invitation has been sent successfully!",
      });
    }
    setSelectedTab("bodyMeasurements")
    setSendingEmail(false);
  };

  const handleSaveMeasurements = (data: any) => {
    setMeasurementData(data);
  };

  const submitMeasurement = async () => {
    try {
      let bodyData;
      if (measurmentType === 'online') {
        bodyData = {
          eventId: eventData?.id,
          userId: userData?.id,
          outfitId: eventData?.outfits?.[0]?.id,
          ...measurementData,
          men_type: measurementData?.genderType,
          chest_over_arms: parseFloat(measurementData?.chestOverArms),
          trouser_waist_size: parseFloat(measurementData?.trouserWaist),
          trouser_length: parseFloat(measurementData?.trouserLength),
          shirt_neck_size: parseFloat(measurementData?.shirtNeckSize),
          shirt_sleeve_length: parseFloat(measurementData?.shirtSleeveLength),
          body_type: measurementData?.bodyType,
          shoe_size: measurementData?.shoeSize,
          measurementProvinience:measurmentType
        }
      }else{
        bodyData = {
          eventId:eventData?.id,
          measurementProvinience: measurmentType,
          userId: userData?.id,
          outfitId: eventData?.outfits?.[0]?.id,
          measurementProvienenceDate:selectedDate||"",
          store:selectedStore || "",
          men_type:'men'
        }
      }
      const response = await EventDetailsServices.saveCustomerMeasurement(bodyData);
      if (response?.status) {
        modalNotification({
          type: 'success',
          message: response?.message || "Measurement has been saved successfully!"
        });
        setSelectedTab('checkout')
      }
    } catch (error) {
      logger("Error while saving a measurement : ", error);
    }
  }

  const getParticipantsEmails = (data) => {
    if (data && data.length) {
      let emails = "";
      data.forEach((p, i) => {
        if (p.email) {
          emails += p.email;
          if (i !== data.length - 1) {
            emails += ", ";
          }
        }
      });
      setEmails(emails);
    }
  }

  useEffect(() => {
    getOutfitLayers();
    const randomString = generateRandomCode();
    setReferenceId(randomString);
    getParticipantsEmails(participants)
  }, [outfits])

  const renderCurrentContent = () => {
    switch (selectedTab) {
      case "addOutfit":
        return (
          <AddOutfitAndMemberComponent
            outfits={outfits}
            outfitLayers={eventOutfitLayers}
            addOutfit={addOutfit}
            duplicateOutfit={duplicateOutfit}
            deleteOutfit={deleteOutfit}
            editOutfit={editOutfit}
            handleNext={() => setSelectedTab("sendInvite")}
          />
        );
      case "sendInvite":
        return (
          <SendInvite
            handleNext={() => setSelectedTab("bodyMeasurements")} // Go to measurement selection
            handlePrevious={() => setSelectedTab("addOutfit")}
            getParticipantsStatus={getParticipantsStatus}
            participants={participants}
            referenceId={referenceId}
            emails={emails}
            setEmails={setEmails}
            handleSendInvitation={handleSendInvitation}
            sendingEmail={sendingEmail}
          />
        );
      case "bodyMeasurements":
        return <MeasurementComponent
          key='measurement_form'
          participants={participants}
          setSelectedTab={setSelectedTab}
          handleSaveMeasurements={handleSaveMeasurements}
          setShowMeasurementForm={setShowMeasurementForm}
          measurementType={measurmentType}
          setMeasurementType={setMeasurementType}
          measurementData={measurementData}
          submitMeasurement={submitMeasurement}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
        />;
      case "checkout":
        return (
          <CheckoutSection
            handlePrevious={() => {
              setSelectedTab("bodyMeasurements");
            }}
            orderId={orderId}
            onSubmit={placedOrder}
            isOrderPlaced={isOrderPlaced}
            setIsOrderPlaced={setIsOrderPlaced}
            selectedStore={selectedStore}
            setSelectedStore={setSelectedStore}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <header className="bg-gray-100 py-4 px-6 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">EVENT DETAIL</h1>
          <p className="text-sm text-gray-500">HOME / LOOKS</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-semibold">{`${eventData?.firstName} ${eventData?.lastName}`}</p>
            <p className="text-sm text-gray-500">
              {`${eventData?.eventName} – ${formatDate(eventData?.eventDate)}`}
            </p>
          </div>
        </div>
      </header>

      {/* Tabs - only show when not in measurement form */}
      {!showMeasurementForm && (
        <div className="flex items-center justify-center bg-white py-4 text-white">
          {[
            { id: "addOutfit", label: "Add Outfit and Member" },
            { id: "sendInvite", label: "Send Invite" },
            { id: "bodyMeasurements", label: "Body Measurements" },
            { id: "checkout", label: "Checkout" },
          ].map((step, index, arr) => {
            const isActive = selectedTab === step.id;
            const isCompleted =
              arr.findIndex((s) => s.id === selectedTab) > index;

            return (
              <div key={index} className="flex items-center">
                <div
                  className={`flex font-advent items-center justify-center w-10 h-10 rounded-full font-semibold 
                    ${isActive
                      ? "bg-[#D6A680] text-white"
                      : isCompleted
                        ? "bg-[#D6A680] text-white"
                        : "bg-[#F8F8F8] text-black"
                    } transition-colors duration-200`}
                >
                  {index + 1}
                </div>

                <div
                  className={`ml-2 font-advent font-semibold cursor-pointer 
                    ${isActive ? "text-[#2c2727]" : "text-gray-300"}`}
                >
                  {step.label}
                </div>

                {index < arr.length - 1 && (
                  <div className="w-16 h-[2px] bg-[#e1d9d2] mx-4"></div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {renderCurrentContent()}

      <FooterLookBuilder />
      <SidebarForm
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleAddDuplicateOutfit}
        getTotalPrice={() => 0}
        priceType={priceType || ""}
      />
    </div>
  );
};

export default EventDetail;
