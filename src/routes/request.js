const express = require("express");
const authRequest = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

authRequest.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserName = req.user.firstName;
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedstatuses = ["ignored", "interested"];
      if (!allowedstatuses.includes(status)) {
        return res.status(400).send("Invalid status :" + status);
      }

      //check if the user is trying to send a request to themselves
      if (fromUserId.equals(toUserId)) {
        return res.status(400).send("You cannot send a request to yourself");
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found");
      }

      // Check if a request already exists
      const existingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingRequest) {
        return res.status(400).send("Connection request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
        fromUserName: fromUserName,
      });

      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} has ${
          status === "interested" ? "shown interest in" : "ignored"
        } ${toUser.firstName}`,

        requestId: data._id,
        data,
      });
    } catch (err) {
      res.status(400).send("Error in sending request");
    }
  }
);

authRequest.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ messaage: "Status not allowed!" });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);
module.exports = authRequest;
