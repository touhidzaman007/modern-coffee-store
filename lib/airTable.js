const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
}).base(process.env.AIRTABLE_BASE_ID);

const table = base('coffee-stores');

const getMinifiedRecord = record => {
  return {
    recordId: record.id,
    ...record.fields,
  };
};

const getMinifiedRecords = records => {
  return records.map(record => getMinifiedRecord(record));
};

const findRecordsByFilter = async id => {
  const findCoffeeStoreRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return getMinifiedRecords(findCoffeeStoreRecords);
};

export { table, getMinifiedRecords, findRecordsByFilter };
