const { readCSV } = require("../../src/csvReader");
const { parseSelectQuery, parseJoinClause } = require("../../src/queryParser");
const { executeSELECTQuery } = require("../../src/index");

test("Read CSV File", async () => {
  const data = await readCSV("./student.csv");
  expect(data.length).toBeGreaterThan(0);
  expect(data.length).toBe(4);
  expect(data[0].name).toBe("John");
  expect(data[0].age).toBe("30"); //ignore the string type here, we will fix this later
});

test("Parse SQL Query", () => {
  const query = "SELECT id, name FROM student";
  const parsed = parseSelectQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "student",
    joinCondition: null,
    joinTable: null,
    isDistinct: false,
    limit: null,
    joinType: null,
    groupByFields: null,
    orderByFields: null,
    hasAggregateWithoutGroupBy: false,
    whereClauses: [],
  });
});

test("Execute SQL Query", async () => {
  const query = "SELECT id, name FROM student";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBeGreaterThan(0);
  expect(result[0]).toHaveProperty("id");
  expect(result[0]).toHaveProperty("name");
  expect(result[0]).not.toHaveProperty("age");
  expect(result[0]).toEqual({ id: "1", name: "John" });
});

test("Parse SQL Query with Multiple WHERE Clauses", () => {
  const query = "SELECT id, name FROM student WHERE age = 30 AND name = John";
  const parsed = parseSelectQuery(query);
  expect(parsed).toEqual({
    fields: ["id", "name"],
    table: "student",
    joinCondition: null,
    joinTable: null,
    limit: null,
    isDistinct: false,
    joinType: null,
    groupByFields: null,
    orderByFields: null,
    hasAggregateWithoutGroupBy: false,
    whereClauses: [
      {
        field: "age",
        operator: "=",
        value: "30",
      },
      {
        field: "name",
        operator: "=",
        value: "John",
      },
    ],
  });
});

test("Execute SQL Query with Multiple WHERE Clause", async () => {
  const query = "SELECT id, name FROM student WHERE age = 30 AND name = John";
  const result = await executeSELECTQuery(query);
  expect(result.length).toBe(1);
  expect(result[0]).toEqual({ id: "1", name: "John" });
});
