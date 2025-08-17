import React, { useState } from "react";
import DateSelectionModal from "./DateSelectionModal";
import TimeSlotModal from "./TimeSlotModal";
import CustomizationsModal from "./CustomizationsModal";
import LoginModal from "./LoginModal";

const BookingFlow = ({ show, onHide, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingDetails, setBookingDetails] = useState({
    selectedDate: null,
    selectedTimeSlot: null,
    selectedCustomizations: []
  });

  const handleDateSelect = (date) => {
    // Convert Date object to formatted string to prevent rendering issues
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    setBookingDetails(prev => ({ ...prev, selectedDate: formattedDate }));
    goToNextStep();
  };

  const handleTimeSelect = (timeSlot) => {
    // Store the time slot object which contains id, time, and available properties
    setBookingDetails(prev => ({ ...prev, selectedTimeSlot: timeSlot }));
    goToNextStep();
  };

  const handleCustomizationsSelect = (customizations) => {
    setBookingDetails(prev => ({ ...prev, selectedCustomizations: customizations }));
    goToNextStep();
  };

  const handleLoginSuccess = (loginData) => {
    // In real app, you would handle the login success and proceed to checkout
    
    // You can navigate to checkout or address selection here
    onComplete({
      ...bookingDetails,
      loginData
    });
    
    // Reset the flow
    resetFlow();
  };

  const resetFlow = () => {
    setCurrentStep(1);
    setBookingDetails({
      selectedDate: null,
      selectedTimeSlot: null,
      selectedCustomizations: []
    });
    onHide();
  };

  const goToNextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleClose = () => {
    resetFlow();
  };

  // Debug info - remove in production
  console.log('BookingFlow render:', { show, currentStep, bookingDetails });

  return (
    <>
      {/* Step 1: Date Selection */}
      <DateSelectionModal
        show={show && currentStep === 1}
        onHide={handleClose}
        onDateSelect={handleDateSelect}
        onNext={goToNextStep}
        onBack={goToPreviousStep}
      />

      {/* Step 2: Time Slot Selection */}
      <TimeSlotModal
        show={show && currentStep === 2}
        onHide={handleClose}
        onTimeSelect={handleTimeSelect}
        onNext={goToNextStep}
        onBack={goToPreviousStep}
        selectedDate={bookingDetails.selectedDate}
      />

      {/* Step 3: Customizations/Add-ons */}
      <CustomizationsModal
        show={show && currentStep === 3}
        onHide={handleClose}
        onCustomizationsSelect={handleCustomizationsSelect}
        onNext={goToNextStep}
        onBack={goToPreviousStep}
        selectedDate={bookingDetails.selectedDate}
        selectedTimeSlot={bookingDetails.selectedTimeSlot}
      />

      {/* Step 4: Login */}
      <LoginModal
        show={show && currentStep === 4}
        onHide={handleClose}
        onLoginSuccess={handleLoginSuccess}
        onBack={goToPreviousStep}
        bookingDetails={bookingDetails}
      />
    </>
  );
};

export default BookingFlow;