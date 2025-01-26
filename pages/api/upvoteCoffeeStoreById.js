import {
  table,
  getMinifiedRecords,
  findRecordsByFilter,
} from '../../lib/airTable';

// pages/api/upvoteCoffeeStoreById.js
const upvoteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.body;
    try {
      if (id) {
        const records = await findRecordsByFilter(id);
        if (records.length !== 0) {
          // Get current voting count
          const updatedVoting = parseInt(records[0].voting) + 1;
          // console.log(updatedVoting);

          // Update record with incremented voting
          const updateRecords = await table.update([
            {
              id: records[0].recordId,
              fields: {
                voting: updatedVoting,
              },
            },
          ]);
          if (updateRecords) {
            const minifiedRecord = getMinifiedRecords(updateRecords);
            res.json(minifiedRecord);
          }
        } else {
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      }
    } catch (error) {
      console.error('Error upvoting coffee store', error);
      res.status(500).json({ message: 'Error upvoting coffee store', error });
    }
  }
};

export default upvoteCoffeeStoreById;
