import db from "../db/ConnectDB";



const invertoryService = {
  createInventory: async (data: any) => {
    const { productId, quantity } = data || {};

    await db.query(
      `INSERT INTO inventory (product_id, stock,reserved_stock,available_stock)
       VALUES ($1, $2,0,$2)
       RETURNING *`,
      [productId, quantity],
    );
  },
  getInventory: async (id: string) => {
    const result = await db.query(
      `SELECT * FROM inventory WHERE product_id = $1`,
      [id],
    );
    return result.rows[0];
  },

  stockReservation: async (data:{
    productId: string;
    quantity: number;
    orderId: string;
  }) => {

  }
};

export default invertoryService;
