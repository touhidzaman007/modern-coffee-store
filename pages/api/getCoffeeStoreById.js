import { findRecordsByFilter } from '../../lib/airTable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Id is required' });
    }

    const records = await findRecordsByFilter(id);

    if (!records.length) {
      return res
        .status(404)
        .json({ message: `Coffee store with id ${id} not found` });
    }

    return res.json(records);
  } catch (error) {
    console.error('Error finding coffee store:', error);
    return res
      .status(500)
      .json({ message: 'Error finding coffee store', error: error.message });
  }
};

export default getCoffeeStoreById;
