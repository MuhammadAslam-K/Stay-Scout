import Rooms from "../../model/roomsModel.js";


// For showing the room status to the owner
const roomStatus = async (req, res) => {
    try {
        const roomId = req.session.ROOMID;
        const roomno = parseInt(req.query.no, 10);
        const room = await Rooms.findById(roomId);
        const specificRoom = room.availableRooms.find((roomInfo) => roomInfo.roomNo === roomno);

        const checkInDates = specificRoom.checkIn;
        const checkOutDates = specificRoom.chekout;

        res.render("calender", {
            checkInDates: JSON.stringify(checkInDates),
            checkOutDates: JSON.stringify(checkOutDates)
        });
    } catch (error) {
        console.log(error);
        res.render("500");
    }
};





// To display the rooms
const viewRooms = async (req, res) => {
    try {
        const roomId = req.query.id
        req.session.ROOMID = roomId
        const rooms = await Rooms.findById(roomId)

        res.render("viewRooms", { rooms })

    } catch (error) {
        console.log(error)
        res.render("500")
    }
}


const isAvaillable = (async (req, res) => {
    try {
        const id = req.session.ROOMID
        const roomNo = req.query.no
        const room = await Rooms.findById(id)
        const roomToUpdate = room.availableRooms.find(room => room.roomNo == roomNo);

        roomToUpdate.is_Available = !roomToUpdate.is_Available;
        await room.save();
        res.status(200).end()

    } catch (error) {
        console.log(error);
        return res.status(500);
    }
})


// For adding the4 room
const addRoom = (async (req, res) => {
    try {
        const { input } = req.params
        const parseInput = parseInt(input)
        const roomId = req.session.ROOMID
        const room = await Rooms.findById(roomId)

        for (let i = 0; i < parseInput; i++) {
            let roomNo = 1
            roomNo += room.availableRooms.length

            let newRoom = {
                roomNo,
            }
            room.availableRooms.push(newRoom)
        }
        room.noOfRooms += parseInput
        room.save()

        return res.status(200).end()
    } catch (error) {
        return res.status(500).end()
    }
})


export default {
    roomStatus,
    viewRooms,
    isAvaillable,
    addRoom,
}