import AllowedEmail from "./allowedEmailModel.js";
import User from "./userModel.js";
import Admin from "./adminModel.js";
import Team from "./teamModel.js";
import Track from "./trackModel.js";
import Round from "./roundModel.js";
import Submission from "./submissionModel.js";
import Score from "./scoreModel.js";
import Result from "./resultModel.js";

// User ↔ AllowedEmail (1:1)
AllowedEmail.hasOne(User, {
  foreignKey: "email",
  sourceKey: "email",
  as: "user",
  onDelete: "CASCADE",
});

User.belongsTo(AllowedEmail, {
  foreignKey: "email",
  targetKey: "email",
  as: "allowedEmail",
  onDelete: "CASCADE",
});


// User ↔ Team (1:1) Leader
User.hasOne(Team, {
  foreignKey: "leaderId",
  sourceKey: "id",
  as: "ledTeam",
  onDelete: "CASCADE"
});

Team.belongsTo(User, {
  foreignKey: "leaderId",
  targetKey: "id",
  as: "leader",
  onDelete: "CASCADE"
});

// Team ↔ User (1:N) members
Team.hasMany(User, {
  foreignKey: "teamNo",
  sourceKey: "srNo",
  as: "members",
  onDelete: "CASCADE"
});

User.belongsTo(Team, {
  foreignKey: "teamNo",
  targetKey: "srNo",
  as: "team",
  onDelete: "CASCADE"
});

// Track ↔ Team (1:N) track
Track.hasMany(Team, {
  foreignKey: "trackId",
  sourceKey: "id",
  as: "teams",
  onDelete: "CASCADE"
});

Team.belongsTo(Track, {
  foreignKey: "trackId",
  sourceKey: "id",
  as: "track",
  onDelete: "CASCADE"
});



// Submission ↔ Team (N:1)
Team.hasMany(Submission, {
  foreignKey: "teamSrNo",
  sourceKey: "srNo",
  as: "submissions",
  onDelete: "CASCADE"
});

Submission.belongsTo(Team, {
  foreignKey: "teamSrNo",
  targetKey: "srNo",
  as: "team",
  onDelete: "CASCADE"
});


// Submission ↔ Round (N:1)
Round.hasMany(Submission, {
  foreignKey: "roundId",
  sourceKey: "id",
  as: "submissions",
  onDelete: "CASCADE"
});

Submission.belongsTo(Round, {
  foreignKey: "roundId",
  targetKey: "id",
  as: "round",
  onDelete: "CASCADE"
});


// Score ↔ Team (N:1)
Team.hasMany(Score, {
  foreignKey: "teamSrNo",
  sourceKey: "srNo",
  as: "scores",
  onDelete: "CASCADE"
});

Score.belongsTo(Team, {
  foreignKey: "teamSrNo",
  targetKey: "srNo",
  as: "team",
  onDelete: "CASCADE"
});


// Score ↔ Round (N:1)
Round.hasMany(Score, {
  foreignKey: "roundId",
  sourceKey: "id",
  as: "scores",
  onDelete: "CASCADE"
});

Score.belongsTo(Round, {
  foreignKey: "roundId",
  targetKey: "id",
  as: "round",
  onDelete: "CASCADE"
});

// Result ↔ Team (N:1)
Team.hasMany(Result, { 
    foreignKey: "teamSrNo", 
    sourceKey: "srNo",
    as: "results", 
    onDelete: "CASCADE" 
});

Result.belongsTo(Team, { 
    foreignKey: "teamSrNo", 
    targetKey: "srNo",
    as: "team", 
    onDelete: "CASCADE" 
});

export { AllowedEmail, User, Admin, Team, Track, Round, Submission, Score, Result };