import { Table } from '../../hasura-metadata-types';
import { TrackableTable } from './types';

export const getQualifiedTable = (table: Table): string[] => {
  if (Array.isArray(table)) return table;

  // This is a safe assumption to make because the only native database that supports functions is postgres( and variants)
  if (typeof table === 'string') return ['public', table];

  const postgresOrMssqlTable = table as {
    schema: string;
    name: string;
  };

  if ('schema' in postgresOrMssqlTable)
    return [postgresOrMssqlTable.schema, postgresOrMssqlTable.name];

  const bigQueryTable = table as { dataset: string; name: string };

  if ('dataset' in bigQueryTable)
    return [bigQueryTable.dataset, bigQueryTable.name];

  return [];
};

export const paginate = <T>(
  array: T[],
  page_size: number,
  page_number: number
): T[] => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
};

export const search = (tables: TrackableTable[], searchText: string) => {
  if (!searchText.length) return tables;

  return tables.filter(table =>
    table.name.toLowerCase().includes(searchText.toLowerCase())
  );
};