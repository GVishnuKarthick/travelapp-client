import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { AppContext } from '../context/AppContext';

const CalendarView = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('CalendarView must be used within AppProvider');
    return <div>Context not available.</div>;
  }

  const { itineraries } = context;
  const navigate = useNavigate();

  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(1);

  const years = [2026, 2027, 2028, 2029, 2030];

  const months = [
    { value: 0, name: 'January' },
    { value: 1, name: 'February' },
    { value: 2, name: 'March' },
    { value: 3, name: 'April' },
    { value: 4, name: 'May' },
    { value: 5, name: 'June' },
    { value: 6, name: 'July' },
    { value: 7, name: 'August' },
    { value: 8, name: 'September' },
    { value: 9, name: 'October' },
    { value: 10, name: 'November' },
    { value: 11, name: 'December' }
  ];

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  const getStartingDay = (year, month) =>
    new Date(year, month, 1).getDay();

  const handlePrevious = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    if (newYear >= years[0]) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const handleNext = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    if (newYear <= years[years.length - 1]) {
      setCurrentMonth(newMonth);
      setCurrentYear(newYear);
    }
  };

  const handleYearChange = (e) => setCurrentYear(parseInt(e.target.value));
  const handleMonthChange = (e) => setCurrentMonth(parseInt(e.target.value));

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getStartingDay(currentYear, currentMonth);

  const calendarDays = [];
  for (let i = 0; i < startingDay; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  const getIsTripDay = (day) => {
    if (!day) return false;

    const currentDate = new Date(currentYear, currentMonth, day);
    currentDate.setHours(0, 0, 0, 0);

    return itineraries.some((trip) => {
      if (!trip.startDate || !trip.endDate) return false;

      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return currentDate >= start && currentDate <= end;
    });
  };

  const sortedUpcomingItineraries = [...itineraries]
    .filter((trip) => {
      if (!trip.startDate) return false;
      const start = new Date(trip.startDate);
      start.setHours(0, 0, 0, 0);
      return start >= new Date(currentYear, currentMonth, 1);
    })
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Travel Calendar</h2>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
                <div className="flex gap-2 sm:gap-4 mb-2 sm:mb-0">
                  <select
                    value={currentMonth}
                    onChange={handleMonthChange}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-zinc-800 text-white rounded-lg text-sm sm:text-base"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={currentYear}
                    onChange={handleYearChange}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-zinc-800 text-white rounded-lg text-sm sm:text-base"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1 sm:px-4 sm:py-2 bg-zinc-800 text-white rounded-lg text-sm sm:text-base" onClick={handlePrevious}>
                    Previous
                  </button>
                  <button className="px-3 py-1 sm:px-4 sm:py-2 bg-zinc-800 text-white rounded-lg text-sm sm:text-base" onClick={handleNext}>
                    Next
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4 sm:mb-6 text-xs sm:text-sm">
                {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                  <div key={day} className="text-center text-gray-400 font-semibold">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs sm:text-sm">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`aspect-square flex items-center justify-center rounded-lg border ${
                      day
                        ? getIsTripDay(day)
                          ? 'bg-red-600/20 border-red-600 text-red-500 font-bold'
                          : 'bg-black border-zinc-800 text-gray-400'
                        : 'border-transparent bg-transparent'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-800">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">Upcoming Trips</h3>

                {sortedUpcomingItineraries.length === 0 ? (
                  <p className="text-gray-400 text-sm sm:text-base">
                    No upcoming trips in or after {months[currentMonth].name} {currentYear}.
                  </p>
                ) : (
                  sortedUpcomingItineraries.map((trip) => (
                    <div
                      key={trip.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-black border border-zinc-800 rounded-lg hover:border-red-600 transition mb-2 sm:mb-3"
                    >
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base">{trip.destination}</p>
                        <p className="text-red-500 text-xs sm:text-sm">
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                        className="mt-1 sm:mt-0 text-red-600 hover:text-red-500 text-xs sm:text-sm font-semibold"
                      >
                        View Details →
                      </button>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarView;