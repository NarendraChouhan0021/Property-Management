'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("Properties", {
      properties_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
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
    });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("Properties");
  },
};
