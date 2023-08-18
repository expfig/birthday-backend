const sequelize = require("sequelize");
const sgt20 = {
  dialect: "postgres",
  host: "10.56.131.105",
  username: "postgres",
  password: "postgres",
  database: "sgt20",

  define: {
    timestamps: true,
    underscored: true,
  },
};

const sgtconnect = new sequelize(sgt20);

module.exports = sgtconnect;
