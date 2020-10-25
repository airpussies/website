export const group_by = function (key, data) {

  return data.reduce(function (acc, item) {
    let group_by_value = item[key];
    acc.groups = acc.groups || [];
    if (!acc.groups.includes(group_by_value)) {
      acc.groups.push(group_by_value);
    }
    acc.entries = acc.entries || {};
    acc.entries[group_by_value] = (acc.entries[group_by_value] || []);
    acc.entries[group_by_value].push(item);
    return acc;
  }, {})

}