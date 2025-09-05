import {Router} from 'express';
import verifyFirebaseToken from '../../middleware/verifyFirebaseToken.js';
import verifyAllowed from '../../middleware/verifyAllowed.js';
import User from '../../models/userModel.js';
import Chance from 'chance';
import Team from '../../models/teamModel.js';
import Track from '../../models/trackModel.js';
import sequelize from '../../config/db.js';

const teamRouter = Router();


//Create a new team
teamRouter.post("/create", verifyFirebaseToken, verifyAllowed, async(req, res) => {
    //Get the Data
    const {leaderId, name, trackId} = req.body;
    if(!leaderId || !name || !trackId){
        return res.status(400).json({
            message : "Try Again, Some Data is missing"
        })
    }

    //Check if user is already in a team -> (40_) and if track is present
    const [user, track] = await Promise.all([
        User.findByPk(leaderId),
        Track.findByPk(trackId)
    ])
    if(!user) 
        return res.status(400).json({ message : "User does not exist" })

    if(user.teamNo)
        return res.status(400).json({ message : "You are already part of a team" })

    if(!track)
        return res.status(400).json({ "message" : "Please enter a valid Track" })

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
                leaderId,
                trackId
                },
                {transaction : t}
            )
            
            //Add team id to the user entity
            user.teamNo = team.srNo;
            await user.save({transaction : t});

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
teamRouter.post("/create", verifyFirebaseToken, verifyAllowed, async(req, res) => {
    res.json({
        message : "Reached end of endpoint"
    })
})


export default teamRouter;