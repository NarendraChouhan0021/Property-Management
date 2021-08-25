const { Properties, Images } = require("../modal");
const Sequelize = require("sequelize");
const sharp = require("sharp");
const path = require("path");

const getPropertyList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const isAlltrue = Boolean(req.query.isAlltrue) || false;

    const searchByArea = req.query.searchByArea
      ? decodeURIComponent(req.query.searchByArea)
      : "";

    const searchByPriceRange = req.query.searchByPriceRange
      ? decodeURIComponent(req.query.searchByPriceRange)
      : "";

    const searchByBedroom = parseInt(req.query.searchByBedroom) || 0;

    const startingDate = req.query.startingDate
      ? decodeURIComponent(req.query.startingDate)
      : "";

    const endingDate = req.query.endingDate
      ? decodeURIComponent(req.query.endingDate)
      : "";

    const recentHistory = Boolean(req.query.recentHistory) || false;

    let findQuery = { where: {} };
    let countQuery = { where: {} };

    if (page || pageSize) {
      findQuery = {
        ...findQuery,
        limit: parseInt(pageSize),
        offset: (parseInt(page) - 1) * parseInt(pageSize),
      };
      countQuery = {};
    }

    if (isAlltrue) {
      findQuery = {};
      countQuery = {};
    }

    if (searchByArea && searchByArea.length) {
      const list = searchByArea.split(",");
      findQuery["where"] = { ...findQuery["where"], area: { [Sequelize.Op.in]: list } };
      countQuery = findQuery;
    }

    if (startingDate && startingDate.length && endingDate && endingDate.length) {
      findQuery["where"] = {
        ...findQuery["where"],
        createdAt: { [Sequelize.Op.between]: [startingDate, endingDate] },
      };
      countQuery = findQuery;
    }

    if (searchByBedroom) {
      findQuery["where"] = {
        ...findQuery["where"],
        bedroom: { [Sequelize.Op.eq]: searchByBedroom },
      };
      countQuery = findQuery;
    }

    if (searchByPriceRange && searchByPriceRange.length) {
      const range = searchByPriceRange.split(",").map((item) => parseInt(item));
      findQuery["where"] = {
        ...findQuery["where"],
        price: { [Sequelize.Op.between]: range },
      };
      countQuery = findQuery;
    }

    if (recentHistory) {
      findQuery = {
        ...findQuery,
        where: {
          ...findQuery["where"],
          lastView: {
            [Sequelize.Op.not]: null,
          },
        },
        order: [
          ["lastView", "DESC"], // Sorts by lastView in ascending order
        ],
      };
      countQuery = findQuery;
    }

    // recentHistory

    const allProperty = await Properties.findAll(findQuery);
    const total = await Properties.count(countQuery);
    const propertyList = allProperty;

    for (let i in propertyList) {
      propertyList[i] = propertyList[i]["dataValues"];
      const images = await Images.findAll({
        where: { properties_id: propertyList[i]["properties_id"] },
        attributes: {
          exclude: ["createdAt", "updatedAt", "properties_id", "image_id"],
        },
      });
      propertyList[i]["images"] = images;
    }
    return res.status(200).json({
      isSucceed: true,
      message: "list of properties",
      data: { totalCount: total, doc: propertyList },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSucceed: false,
      message: error.toString(),
    });
  }
};

const addProperty = async (req, res) => {
  try {
    if (!req.body || !Object.keys(req.body).length) {
      return res.status(400).send({
        isSucceed: false,
        message: "Content can not be empty!",
      });
    }

    const {
      name,
      description,
      address,
      area,
      price,
      bathroom,
      bedroom,
      carpetArea,
    } = req.body;

    const property = await Properties.create({
      name,
      description,
      address,
      area,
      price,
      bathroom,
      bedroom,
      carpetArea,
    });

    const obj = {
      ...property.dataValues,
    };
    const images = [];
    if (req.files) {
      for (let file of req.files) {
        const properties_id = obj && obj.properties_id ? obj.properties_id : "";
        const { filename: image } = file;
        await sharp(file.path, { failOnError: false })
          .resize(64, 64)
          .withMetadata()
          .toFile(
            path.resolve(
              file.destination,
              image.replace(/\.(jpeg|png)$/, `_thumbs.jpg`)
            )
          );
        const originalImage = file.path;
        const thumbnailImage =
          "uploads/" + image.replace(/\.(jpeg|png)$/, `_thumbs.jpg`);

        images.push({
          main: originalImage,
          thumbnail: thumbnailImage,
          properties_id,
        });
      }
    }
    await Images.bulkCreate(images);
    obj["images"] = images;
    return res.status(200).json({
      isSucceed: true,
      message: "property has added successfully",
      data: obj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSucceed: false,
      message: error.toString(),
    });
  }
};

const getPropertyDetails = async (req, res) => {
  try {
    const properties_id = req.params.properties_id;
    const isFavourite = req.query.isFavourite ? req.query.isFavourite : "";
    if (isFavourite && isFavourite.length) {
      const isFav = String(isFavourite).toLowerCase() == "true";
      await Properties.update(
        { isFavourite: isFav },
        { where: { properties_id } }
      );
    }
    await Properties.update(
      { viewCount: Sequelize.literal("viewCount + 1"), lastView: Date.now() },
      { where: { properties_id } }
    );
    const propertyDetails = await Properties.findByPk(properties_id);
    let propertyList = propertyDetails;
    propertyList = propertyList["dataValues"];
    const images = await Images.findAll({
      where: { properties_id: propertyList["properties_id"] },
      attributes: {
        exclude: ["createdAt", "updatedAt", "properties_id", "image_id"],
      },
    });
    propertyList["images"] = images;

    return res.status(200).json({
      isSucceed: true,
      message: "properties details",
      data: propertyList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      isSucceed: false,
      message: error.toString(),
    });
  }
};

module.exports = { getPropertyList, addProperty, getPropertyDetails };
