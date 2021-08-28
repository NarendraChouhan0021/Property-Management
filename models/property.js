
"use strict"

module.exports = (sequelize, DataTypes) => {
  const properties = sequelize.define(
    "Properties",
    {
      properties_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        // unique: true,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      bathroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bedroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      carpetArea: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      viewCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isFavourite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lastView: {
        type: DataTypes.DATE,
        allowNull: true,
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
      tableName: "Properties",
      timestamps: true,
    }
  );
  properties.associate = ({ Properties, Images }) => {
    Properties.hasMany(Images, { foreignKey: "properties_id" });
    Images.belongsTo(Properties, { foreignKey: "properties_id" });
  };

  return properties;
};