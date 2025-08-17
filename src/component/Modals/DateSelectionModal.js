import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/DateSelectionModal.css";

const DateSelectionModal = ({ show, onHide, onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get previous month's last few days
  const prevMonthLastDay = new Date(currentYear, currentMonth, 0);
  const prevMonthDays = prevMonthLastDay.getDate();

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    
    // Previous month days (adjust for Monday start)
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push({
        day,
        isCurrentMonth: false,
        isSelectable: false,
        date: new Date(currentYear, currentMonth - 1, day)
      });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const today = new Date();
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      days.push({
        day,
        isCurrentMonth: true,
        isSelectable: !isPast,
        isToday,
        date
      });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isSelectable: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }
    
    return days;
  };

  const handleDateClick = (dayData) => {
    if (dayData.isSelectable) {
      console.log('Date clicked:', dayData.date);
      setSelectedDate(dayData.date);
      
      // Auto-advance after short delay for better UX
      setTimeout(() => {
        onDateSelect(dayData.date);
      }, 300);
    }
  };

  // Reset selected date when modal is closed/opened
  useEffect(() => {
    if (!show) {
      setSelectedDate(null);
    }
  }, [show]);

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <Modal className="ModalBox DateSelectionModal" show={show} onHide={onHide} centered>
      <div className="ModalArea">
        <div className="ModalHeader">
          <h3>Select date</h3>
          <button className="CloseModal" onClick={onHide}>
            ×
          </button>
        </div>
        
        <div className="CalendarContainer">
          <div className="CalendarHeader">
            <button className="MonthNavBtn" onClick={handlePrevMonth}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <h4 className="MonthYear">
              {monthNames[currentMonth]} {currentYear}
            </h4>
            <button className="MonthNavBtn" onClick={handleNextMonth}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
          
          <div className="WeekDays">
            {weekDays.map((day, index) => (
              <div key={index} className="WeekDay">{day}</div>
            ))}
          </div>
          
          <div className="CalendarGrid">
            {generateCalendarDays().map((dayData, index) => (
              <div
                key={index}
                className={`CalendarDay ${
                  !dayData.isCurrentMonth ? 'other-month' : ''
                } ${
                  dayData.isToday ? 'today' : ''
                } ${
                  selectedDate && dayData.date.toDateString() === selectedDate.toDateString() ? 'selected' : ''
                } ${
                  !dayData.isSelectable ? 'disabled' : 'selectable'
                }`}
                onClick={() => handleDateClick(dayData)}
              >
                {dayData.day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="WhatsAppHelp">
          <div className="HelpIcon">
            <img src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png" alt="help" />
          </div>
          <span>Can't find required Date or Time? <a href="#" onClick={(e) => e.preventDefault()}>Click here to connect with us on Whatsapp</a></span>
        </div>
      </div>
    </Modal>
  );
};

export default DateSelectionModal;