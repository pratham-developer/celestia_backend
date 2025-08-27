import AllowedEmail from "./allowedEmailModel.js";
import User from "./userModel.js";
import Admin from "./adminModel.js";
import Team from "./teamModel.js";
import Track from "./trackModel.js";
import Round from "./roundModel.js";

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
User.hasOne(Team,{
  foreignKey: "leaderId",
  sourceKey: "id",
  as: "ledTeam",
  onDelete: "CASCADE"
});

Team.belongsTo(User,{
  foreignKey: "leaderId",
  targetKey: "id",
  as: "leader",
  onDelete: "CASCADE"
});

// Team ↔ User (1:N) members
Team.hasMany(User,{
  foreignKey : "teamNo",
  sourceKey : "srNo",
  as : "members",
  onDelete: "CASCADE"
});

User.belongsTo(Team,{
  foreignKey: "teamNo",
  targetKey: "srNo",
  as: "team",
  onDelete: "CASCADE"
});

// Track ↔ Team (1:N) track
Track.hasMany(Team,{
  foreignKey: "trackId",
  sourceKey: "id",
  as: "teams",
  onDelete: "CASCADE"
});

Team.belongsTo(Track,{
  foreignKey: "trackId",
  sourceKey: "id",
  as: "track",
  onDelete: "CASCADE"
})

export { AllowedEmail, User, Admin, Team, Track, Round};