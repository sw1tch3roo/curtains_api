const uuid = require('uuid');
const path = require('path');
const { Device, DeviceCharacteristics } = require('../models/models');
const ApiError = require('../error/ApiError');

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, typeId, date, description, characteristics } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'static', fileName));
      const device = await Device.create({ name, typeId, date, description, img: fileName });

      if (characteristics) {
        characteristics = JSON.parse(characteristics);
        characteristics.forEach((i) =>
          DeviceCharacteristics.create({
            title: i.title,
            description: i.description,
            deviceId: device.id,
          }),
        );
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { typeId, limit, page } = req.query;
    page = page || 1;
    limit = limit || 6;
    let offset = page * limit - limit;
    let devices;
    if (!typeId) {
      devices = await Device.findAndCountAll({ limit, offset });
    }

    if (typeId) {
      devices = await Device.findAndCountAll({ where: { typeId }, limit, offset });
    }

    return res.json(devices);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceCharacteristics, as: 'characteristics' }],
    });
    return res.json(device);
  }
}

module.exports = new DeviceController();
