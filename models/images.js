
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
      },
      createdAt: {
        allowNull: true,
        field: "created_at",
        type: "TIMESTAMP",
      },
      updatedAt: {
        allowNull: true,
        field: "updated_at",
        type: "TIMESTAMP",
      },
    },
    {
      tableName: "Images",
      timestamps: true
    }
  );

  return images;
};