module.exports = class {
  constructor(tableModel) {
    this.table = tableModel;
  }

  async find(props) {
    if (!props) {
      return await this.table.findAll({ raw: true });
    }
    if (props.id) {
      return await this.table.findOne({ where: { id: props.id }, raw: true });
    }
    let select = await this.table.findAll({ where: props, raw: true });
    return select.length == 1 ? select[0] : select;
  }

  async delete(props) {
    if (!props) {
      return new Error("Criterion object is undefined");
    }

    return this.table.destroy({ where: props });
  }

  async save(obj) {
    if (obj.id) {
      const { id, ...restData } = obj;
      return await this.table.update(restData, { where: { id } });
    }
    console.log(obj);
    return (await this.table.create(obj)).get({ plain: true });
  }

  // async pagination(cols, pageNum, limit, sqlFilter) {
  //     limit = limit ?? 10;
  //     cols = cols.join(',');
  //     const sql = `SELECT ${cols} FROM ${this.table} ${sqlFilter ?? ' '} LIMIT ${limit} OFFSET ${(pageNum - 1)*limit}`
  //     const connection = db.connect();
  //     const data = await connection.promise().query(sql);
  //     connection.end();

  //     return data[0];
  // }
};
