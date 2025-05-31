import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Movie = db.define(
  'movies',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cast: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    poster: {
      type: DataTypes.STRING, // or DataTypes.LONGBLOB
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Movie;

(async () => {
  await db.sync({alter: true});
})();