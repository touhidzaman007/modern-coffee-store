import {
  table,
  getMinifiedRecords,
  findRecordsByFilter,
} from '../../lib/airTable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    // find a record
    const { id, name, address, place, voting, imgUrl } = req.body;
    try {
      if (id) {
        const records = await findRecordsByFilter(id);
        if (records.length !== 0) {
          // fetch a record
          res.json(records);
        } else {
          // create a record
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  place,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);
            res.status(200).json(records);
          } else {
            res.status(400).json({ message: 'name or id is missing' });
          }
        }
      } else {
        res.status(400).json({ message: 'Please provide id please' });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Error creating or finding store!', error });
    }
  }
};

export default createCoffeeStore;
