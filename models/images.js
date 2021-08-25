
"use strict";

module.exports = (sequelize, DataTypes) => {
  const images = sequelize.define(
    "Images",
    {
      image_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      main: {
        type: DataTypes.STRING,
        allowNull: false
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      tableName: "Images",
      timestamps: true
    }
  );

  return images;
};