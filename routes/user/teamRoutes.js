import {Router} from 'express';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';
import verifyAllowed from '../../middleware/verifyAllowed.js';
import User from '../../models/userModel.js';
import Chance from 'chance';
import Team from '../../models/teamModel.js';
import Track from '../../models/trackModel.js';
import sequelize from '../../config/db.js';
import verifyLogin from '../../middleware/verifyLogin.js'
import { Op } from 'sequelize';

const teamRouter = Router();

//Create a new team
teamRouter.post("/create", verifyFirebaseToken, verifyAllowed, verifyLogin, async(req, res) => {
    //Get the Data
    const user = req.userData;
    const {name, trackId} = req.body;
    if(!name || !trackId){
        return res.status(400).json({
            message : "Try Again, Some Data is missing"
        })
    }

    if(user.teamNo)
        return res.status(400).json({ message : "You are already part of a team" })

    //Check if user is already in a team -> (40_) and if track is present
    try{
        const track = await Track.findByPk(trackId)
        if(!track)
            return res.status(400).json({ "message" : "Please enter a valid Track" })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" })        
    }
    

    //generate unique code
    const chance = new Chance();
    const generateTeamCode = () => {
        return chance.string({ length: 6, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' });
    }

    let attempts = 0;
    const maxAttempts = 5;
    while(attempts < maxAttempts){
        const t = await sequelize.transaction();
        //try to create a entry in table 
        try{
            const team = await Team.create(
                {
                name,
                teamCode : generateTeamCode(),
                leaderId : user.id,
                trackId
                },
                {transaction : t}
            )
            
            //Add team id to the user entity
            user.teamNo = team.srNo;
            await user.save({transaction : t});

            //Commit the transaction
            await t.commit();
            return res.json({
                message : "Team Created Successfully",
                teamCode : team.teamCode
            })
        }
        //If a error is thrown (not unique) -> regenerate and retry
        catch (err) {
            await t.rollback();
            if (err.name === "SequelizeUniqueConstraintError") {
                attempts++;
                if (attempts >= maxAttempts) {
                    return res.status(500).json({
                        message: "Could not generate unique team code. Please try again.",
                    });
                }
            } else {
                console.error(err);
                return res.status(500).json({ message: "Team creation failed" });
            }
        }
    }
})

//Join a existing team
teamRouter.post("/join", verifyFirebaseToken, verifyAllowed, verifyLogin, async(req, res) => {
    //Get user, teamCode
    const {teamCode} = req.body;
    const user = req.userData;

    //Check if user is already associated witha a team
    if(user.teamNo != null) return res.status(400).json({message : "User is already present in a team"})

    //Check if missing data
    if(!teamCode) return res.status(400).json({message: "Try Again, Team Code is missing"})

    try{
        //Check if the team exists
        const team = await Team.findOne({
            where:{
                teamCode : teamCode
            }
        })
        if(!team) return res.status(400).json({message : "Invalid Team Code"});

        //find the user -> if user exists update the team else respond eith 400
        user.teamNo = team.srNo;
        await user.save();

        //Return success message
        res.json({
            message : "Team is joined successfully"
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" })        
    }
})

//dissolve an existing team
teamRouter.post("/delete", verifyFirebaseToken, verifyAllowed, verifyLogin, async(req, res) => {
    //Check if the user exists
    const user = req.userData;

    //Check if the user  is part of any team
    if(!user.teamNo) return res.status(400).json({message : "User is not part of any team"});

    //Set the team status as dissolved
    try{
        //Updates the team status to dissolved only if team exists and user is the team leader
        const [affectedCount] = await Team.update({status : "dissolved"}, {where : {srNo : user.teamNo, leaderId : user.id}});
        if(affectedCount == 0) return res.status(403).json({message : "Only leader can delete the team"});

        res.json({message : "Your Team is successfully deleted"});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" })        
    }
})

//Make team leader
teamRouter.post("/makeLeader", verifyFirebaseToken, verifyAllowed, verifyLogin, async (req,res) => {
    const leader = req.userData;

    if(!leader.teamNo) return res.status(400).json({message : "You are not part of a team"});

    const {userId} = req.body;
    if(!userId) return res.status(400).json({message: "userId is missing"});

    try{
        const team = await Team.findOne({where : {leaderId: leader.id}});
        
        if (!team) {
            return res.status(403).json({ message: "You are not the leader of any team" });
        }

        if(team.status === "dissolved"){
            return res.status(400).json({
                message: "Leader's team is deleted"
            })
        }

        const user = await User.findByPk(userId);

        if(!user){
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        if(user.teamNo != leader.teamNo){
            return res.status(400).json({
                message: "User is not in the same team as leader"
            })
        }

         if (user.id === leader.id) {
            return res.status(400).json({ message: "You are already the leader" });
        }

        //Changing the leader
        team.leaderId = user.id;
        await team.save();

        return res.json({
            message: "Leader changed successfully",
            leaderId: user.id,
            teamNo: team.srNo
        })
    }
    catch(error){
        console.error(error);
        return res.status(500).json({ message: "Server error" })
    }


})


//leave a team
teamRouter.post("/leave", verifyFirebaseToken, verifyAllowed, verifyLogin, async(req, res) => {
    //Check if the user exists
    const user = req.userData;

    //Check if the user  is part of any team
    if(!user.teamNo) return res.status(400).json({message : "User is not part of any team"});
    const teamNo  = user.teamNo;

    const t = await sequelize.transaction();
    try{
        //Check if user was a leader
        const team = await Team.findOne({where: {leaderId: user.id}});

        if(team){
            const users = await User.findAll({where : {teamNo: teamNo, id: { [Op.not]: user.id }}});
            if(users.length == 0){
                team.status = "dissolved";
                await team.save({transaction: t});
                res.json({
                    message: "You successfully left the team and Team is dissolved"
                })
            }
            else{
                team.leaderId = users[0].id;
                await team.save({transaction: t})
                res.json({
                    message: `You successfully left the team and ${users[0].name} is new leader`,
                    leader : users[0]
                })
            }
        }
        else{
            res.json({message : "You have successfully left the team"});
        }

        user.teamNo = null;
        await user.save({transaction : t});
        await t.commit();
    }
    catch(error){
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: "Server error" })        
    }
})


export default teamRouter;