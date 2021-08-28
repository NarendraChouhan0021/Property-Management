'use strict';

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("Images",
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
      });
      return queryInterface.addColumn("images", "properties_id", {
        type: DataTypes.UUID,
        references: {
          model: "Properties",
          key: "properties_id",
        },
      });
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("Images");
  },
};
