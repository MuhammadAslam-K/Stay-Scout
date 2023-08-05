
// Function to check if a room is available for the given check-in and checkout date range
function roomisAvailable(room, data) {
    const { checkIn, checkOut } = data;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    for (const targetRoom of room.availableRooms) {

        if (!targetRoom.is_Available) {
            continue;
        }

        const bookings = targetRoom.checkIn.map((checkIn, index) => ({
            checkIn: checkIn,
            checkOut: targetRoom.chekout[index]
        }));

        const isRoomBooked = bookings.some(booking =>
            (checkInDate >= booking.checkIn && checkInDate < booking.checkOut) ||
            (checkOutDate > booking.checkIn && checkOutDate <= booking.checkOut) ||
            (checkInDate <= booking.checkIn && checkOutDate >= booking.checkOut)
        );

        if (isRoomBooked) {
            continue; // Check the next available room
        }

        return { available: true, roomNo: targetRoom.roomNo };
    }

    return { available: false, roomNo: null };
}



export default {
    roomisAvailable,
}