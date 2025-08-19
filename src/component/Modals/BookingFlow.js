import React, { useEffect, useState } from "react";
import DateSelectionModal from "./DateSelectionModal";
import TimeSlotModal from "./TimeSlotModal";
import CustomizationsModal from "./CustomizationsModal";
import LoginModal from "./LoginModal";

const BookingFlow = ({ show, onHide, onComplete, selectedProduct, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loginHandled, setLoginHandled] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedCustomizations: [],
  });

  const isLoggedIn = !!user;


  useEffect(() => {
    if (currentStep === 4 && isLoggedIn && !loginHandled) {
      handleLoginSuccess({ user }); // pass user as loginData
      setLoginHandled(true); // prevent double-calls
    }
  }, [currentStep, isLoggedIn, loginHandled]);

  const handleDateSelect = (date) => {
    const formattedDate = date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setBookingDetails((prev) => ({ ...prev, selectedDate: formattedDate }));
    goToNextStep();
  };

  const handleTimeSelect = (timeSlot) => {
    setBookingDetails((prev) => ({ ...prev, selectedTimeSlot: timeSlot }));
    goToNextStep();
  };

  const handleCustomizationsSelect = (customizations) => {
    setBookingDetails((prev) => ({
      ...prev,
      selectedCustomizations: customizations,
    }));
    goToNextStep();
  };

  const handleLoginSuccess = (loginData) => {
    onComplete({ ...bookingDetails, loginData }); // 👈 Pass everything back to parent
    resetFlow();
  };

  const resetFlow = () => {
    setLoginHandled(false); // ✅ Reset this flag
    setCurrentStep(1);
    setBookingDetails({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedCustomizations: [],
    });
    onHide();
  };

  const goToNextStep = () => setCurrentStep((prev) => prev + 1);
  const goToPreviousStep = () => setCurrentStep((prev) => prev - 1);

  const handleEditDate = () => setCurrentStep(1);
  const handleEditTime = () => setCurrentStep(2);
  const handleEditCustomizations = () => setCurrentStep(3);

  return (
    <>
      {/* Step 1: Date Selection */}
      <DateSelectionModal
        show={show && currentStep === 1}
        onHide={resetFlow}
        onDateSelect={handleDateSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 2: Time Slot Selection */}
      <TimeSlotModal
        show={show && currentStep === 2}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        selectedProduct={selectedProduct}
        onTimeSelect={handleTimeSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 3: Customizations */}
      <CustomizationsModal
        show={show && currentStep === 3}
        onHide={resetFlow}
        selectedDate={bookingDetails.selectedDate}
        selectedTimeSlot={bookingDetails.selectedTimeSlot}
        onCustomizationsSelect={handleCustomizationsSelect}
        onBack={goToPreviousStep}
      />

      {/* Step 4: Login */}
      {!isLoggedIn && (
        <LoginModal
          show={show && currentStep === 4}
          onHide={resetFlow}
          bookingDetails={bookingDetails}
          selectedProduct={selectedProduct}
          onLoginSuccess={handleLoginSuccess}
          onBack={goToPreviousStep}
          onEditDate={handleEditDate}
          onEditTime={handleEditTime}
          onEditCustomizations={handleEditCustomizations}
        />
      )}
    </>
  );
};

export default BookingFlow;
