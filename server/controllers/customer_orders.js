const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCustomerOrder(request, response) {
  try {
    const {
      name,
      lastname,
      phone1,
      phone2,
      email,
      company,
      adress1,
      apartment1,
      postalCode1,
      city1,
      country1,
      adress2,
      apartment2,
      postalCode2,
      city2,
      country2,
      sameAddress,
      status,
      orderNotice,
      total,
    } = request.body;

    // minimal validation
    if (
      !name || !lastname || !phone1 || !email ||
      !adress1 || !apartment1 || !postalCode1 || !city1 || !country1 ||
      !status || typeof total !== "number"
    ) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const corder = await prisma.customer_order.create({
      data: {
        name,
        lastname,
        phone1,
        phone2,
        email,
        company,
        adress1,
        apartment1,
        postalCode1,
        city1,
        country1,
        adress2,
        apartment2,
        postalCode2,
        city2,
        country2,
        sameAddress: typeof sameAddress === "boolean" ? sameAddress : true,
        status,
        orderNotice,
        total,
      },
    });

    return response.status(201).json(corder);
  } catch (error) {
    console.error("Error creating order:", error);
    return response.status(500).json({ error: "Error creating order" });
  }
}

async function updateCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    const {
      name,
      lastname,
      phone,
      email,
      company,
      adress,
      apartment,
      postalCode,
      dateTime,
      status,
      city,
      country,
      orderNotice,
      total,
    } = request.body;

    const existingOrder = await prisma.customer_order.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingOrder) {
      return response.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = await prisma.customer_order.update({
      where: {
        id: existingOrder.id,
      },
      data: {
        name,
        lastname,
        phone,
        email,
        company,
        adress,
        apartment,
        postalCode,
        dateTime,
        status,
        city,
        country,
        orderNotice,
        total,
      },
    });

    return response.status(200).json(updatedOrder);
  } catch (error) {
    return response.status(500).json({ error: "Error updating order" });
  }
}

async function deleteCustomerOrder(request, response) {
  try {
    const { id } = request.params;
    await prisma.customer_order.delete({
      where: {
        id: id,
      },
    });
    return response.status(204).send();
  } catch (error) {
    return response.status(500).json({ error: "Error deleting order" });
  }
}

async function getCustomerOrder(request, response) {
  const { id } = request.params;
  const order = await prisma.customer_order.findUnique({
    where: {
      id: id,
    },
  });
  if (!order) {
    return response.status(404).json({ error: "Order not found" });
  }
  return response.status(200).json(order);
}

async function getAllOrders(request, response) {
  try {
    const orders = await prisma.customer_order.findMany({});
    return response.json(orders);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Error fetching orders" });
  }
}

module.exports = {
  createCustomerOrder,
  updateCustomerOrder,
  deleteCustomerOrder,
  getCustomerOrder,
  getAllOrders,
};
