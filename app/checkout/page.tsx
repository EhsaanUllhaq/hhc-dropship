"use client";
import { SectionTitle } from "@/components";
import { useProductStore } from "../_zustand/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isValidEmailAddressFormat, isValidNameOrLastname } from "@/lib/utils";

const CheckoutPage = () => {
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    lastname: "",
    phone1: "",
    phone2: "",
    email: "",
    company: "",
    adress1: "",
    apartment1: "",
    city1: "",
    country1: "",
    postalCode1: "",
    adress2: "",
    apartment2: "",
    city2: "",
    country2: "",
    postalCode2: "",
    orderNotice: "",
    sameAddress: false,
  });
  const { products, total, clearCart } = useProductStore();
  const router = useRouter();

  const makePurchase = async () => {
    if (
      checkoutForm.name.length > 0 &&
      checkoutForm.lastname.length > 0 &&
      checkoutForm.phone1.length > 0 &&
      checkoutForm.phone2.length > 0 &&
      checkoutForm.email.length > 0 &&
      checkoutForm.adress1.length > 0 &&
      checkoutForm.city1.length > 0 &&
      checkoutForm.country1.length > 0 &&
      checkoutForm.postalCode1.length > 0 &&
      (checkoutForm.sameAddress ||
        (checkoutForm.adress2.length > 0 &&
          checkoutForm.city2.length > 0 &&
          checkoutForm.country2.length > 0 &&
          checkoutForm.postalCode2.length > 0))
    ) {
      if (!isValidNameOrLastname(checkoutForm.name)) {
        toast.error("You entered invalid format for name");
        return;
      }

      if (!isValidNameOrLastname(checkoutForm.lastname)) {
        toast.error("You entered invalid format for lastname");
        return;
      }

      if (!isValidEmailAddressFormat(checkoutForm.email)) {
        toast.error("You entered invalid format for email address");
        return;
      }

      // You can add phone validation here if needed

      // sending API request for creating a order
      const response = fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: checkoutForm.name,
          lastname: checkoutForm.lastname,
          phone1: checkoutForm.phone1,
          phone2: checkoutForm.phone2,
          email: checkoutForm.email,
          company: checkoutForm.company,
          adress1: checkoutForm.adress1,
          apartment1: checkoutForm.apartment1,
          postalCode1: checkoutForm.postalCode1,
          city1: checkoutForm.city1,
          country1: checkoutForm.country1,
          adress2: checkoutForm.sameAddress
            ? checkoutForm.adress1
            : checkoutForm.adress2,
          apartment2: checkoutForm.sameAddress
            ? checkoutForm.apartment1
            : checkoutForm.apartment2,
          postalCode2: checkoutForm.sameAddress
            ? checkoutForm.postalCode1
            : checkoutForm.postalCode2,
          city2: checkoutForm.sameAddress
            ? checkoutForm.city1
            : checkoutForm.city2,
          country2: checkoutForm.sameAddress
            ? checkoutForm.country1
            : checkoutForm.country2,
          status: "processing",
          total: total,
          orderNotice: checkoutForm.orderNotice,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          const orderId: string = data.id;
          // for every product in the order we are calling addOrderProduct function that adds fields to the customer_order_product table
          for (let i = 0; i < products.length; i++) {
            console.log("Adding product to order:", products[i]);
            await addOrderProduct(orderId, products[i].id, products[i].amount);
          }
        })
        .then(() => {
          setCheckoutForm({
            name: "",
            lastname: "",
            phone1: "",
            phone2: "",
            email: "",
            company: "",
            adress1: "",
            apartment1: "",
            city1: "",
            country1: "",
            postalCode1: "",
            adress2: "",
            apartment2: "",
            city2: "",
            country2: "",
            postalCode2: "",
            orderNotice: "",
            sameAddress: true,
          });
          clearCart();
          toast.success("Order created successfully");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        });
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const addOrderProduct = async (
    orderId: string,
    productId: string,
    productQuantity: number
  ) => {
    await fetch("http://localhost:3001/api/order-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerOrderId: orderId,
        productId: productId,
        quantity: productQuantity,
      }),
    });
  };

  useEffect(() => {
    if (products.length === 0) {
      toast.error("You don't have items in your cart");
      router.push("/cart");
    }
  }, []);

  // Handler for checkbox toggle
  const handleSameAddressToggle = () => {
    setCheckoutForm((prev) => ({
      ...prev,
      sameAddress: !prev.sameAddress,
      // If checking sameAddress, copy first address to second
      ...(prev.sameAddress
        ? {}
        : {
            adress2: prev.adress1,
            apartment2: prev.apartment1,
            city2: prev.city1,
            country2: prev.country1,
            postalCode2: prev.postalCode1,
          }),
    }));
  };

  // If sameAddress is true, sync second address with first on change
  const handleAddress1Change = (field: string, value: string) => {
    setCheckoutForm((prev) => ({
      ...prev,
      [field]: value,
      ...(prev.sameAddress
        ? {
            adress2: field === "adress1" ? value : prev.adress2,
            apartment2: field === "apartment1" ? value : prev.apartment2,
            city2: field === "city1" ? value : prev.city2,
            country2: field === "country1" ? value : prev.country2,
            postalCode2: field === "postalCode1" ? value : prev.postalCode2,
          }
        : {}),
    }));
  };

  return (
    <div className="bg-white">
      <SectionTitle title="Place Order" path="Home | Cart | Checkout" />
      {/* Background color split screen for large screens */}
      <div
        className="hidden h-full w-1/2 bg-white lg:block"
        aria-hidden="true"
      />
      <div
        className="hidden h-full w-1/2 bg-gray-50 lg:block"
        aria-hidden="true"
      />

      <main className="relative mx-auto grid max-w-screen-2xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="bg-gray-50 px-4 pb-10 pt-16 sm:px-6 lg:col-start-2 lg:row-start-1 lg:bg-transparent lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <h2
              id="summary-heading"
              className="text-lg font-medium text-gray-900"
            >
              Order summary
            </h2>

            <ul
              role="list"
              className="divide-y divide-gray-200 text-sm font-medium text-gray-900"
            >
              {products.map((product) => (
                <li
                  key={product?.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <Image
                    src={
                      product?.image
                        ? `/${product?.image}`
                        : "/product_placeholder.jpg"
                    }
                    alt={product?.title}
                    width={80}
                    height={80}
                    className="h-20 w-20 flex-none rounded-md object-cover object-center"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product?.title}</h3>
                    <p className="text-gray-500">x{product?.amount}</p>
                  </div>
                  <p className="flex-none text-base font-medium">
                    PKR: {product?.price}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="hidden space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-gray-900 lg:block">
              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Subtotal</dt>
                <dd>PKR: {total}</dd>
              </div>

              <div className="flex items-center justify-between">
                <dt className="text-gray-600">Delivery Charges</dt>
                <dd>PKR: 5</dd>
              </div>

              <div className="flex items-center justify-between hidden">
                <dt className="text-gray-600">Taxes</dt>
                <dd>PKR: {(total / 5).toFixed(2)}</dd>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                <dt className="text-base">Total</dt>
                <dd className="text-base">
                  PKR: {total === 0 ? 0 : Math.round(total + total / 5 + 5)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <form className="px-4 pt-16 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0">
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-lg font-medium text-gray-900"
              >
                Contact information
              </h2>

              <div className="mt-6 grid grid-cols-2 gap-x-4">
                <div>
                  <label
                    htmlFor="name-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      value={checkoutForm.name}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          name: e.target.value,
                        })
                      }
                      type="text"
                      id="name-input"
                      name="name-input"
                      autoComplete="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastname-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Lastname
                  </label>
                  <div className="mt-1">
                    <input
                      value={checkoutForm.lastname}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          lastname: e.target.value,
                        })
                      }
                      type="text"
                      id="lastname-input"
                      name="lastname-input"
                      autoComplete="text"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-x-4">
                <div>
                  <label
                    htmlFor="phone1-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Primary Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      value={checkoutForm.phone1}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          phone1: e.target.value,
                        })
                      }
                      type="tel"
                      id="phone1-input"
                      name="phone1-input"
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone2-input"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Secondary Phone number
                  </label>
                  <div className="mt-1">
                    <input
                      value={checkoutForm.phone2}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          phone2: e.target.value,
                        })
                      }
                      type="tel"
                      id="phone2-input"
                      name="phone2-input"
                      autoComplete="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    value={checkoutForm.email}
                    onChange={(e) =>
                      setCheckoutForm({
                        ...checkoutForm,
                        email: e.target.value,
                      })
                    }
                    type="email"
                    id="email-address"
                    name="email-address"
                    autoComplete="email"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </section>

            <section aria-labelledby="shipping-heading" className="mt-2">
              <div className="w-full h-1 border-2 mt-4" />
              <h2
                id="shipping-heading"
                className="text-lg font-medium text-gray-900 mt-4"
              >
                Shipping address 1
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                <div className="sm:col-span-3 hidden">
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="company"
                      name="company"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.company}
                      onChange={(e) =>
                        setCheckoutForm({
                          ...checkoutForm,
                          company: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="adress1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="adress1"
                      name="adress1"
                      autoComplete="street-address"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.adress1}
                      onChange={(e) =>
                        handleAddress1Change("adress1", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="postalCode1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    ZIP / Postal code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode1"
                      name="postalCode1"
                      autoComplete="postal-code"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.postalCode1}
                      onChange={(e) =>
                        handleAddress1Change("postalCode1", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="apartment1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Apartment, House No#, etc.
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="apartment1"
                      name="apartment1"
                      autoComplete="address-line2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.apartment1}
                      onChange={(e) =>
                        handleAddress1Change("apartment1", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="city1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city1"
                      name="city1"
                      autoComplete="address-level2"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.city1}
                      onChange={(e) =>
                        handleAddress1Change("city1", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="country1"
                      name="country1"
                      autoComplete="country-name"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={checkoutForm.country1}
                      onChange={(e) =>
                        handleAddress1Change("country1", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            <section aria-labelledby="shipping-heading2" className="mt-10">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="sameAddress"
                  checked={checkoutForm.sameAddress}
                  onChange={handleSameAddressToggle}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor="sameAddress"
                  className="block text-sm font-medium text-gray-900"
                >
                  Shipping address 2 same as 1
                </label>
              </div>
              {!checkoutForm.sameAddress && (
                <>
                  <div className="w-full h-1 border-2 mt-4" />
                  <h2
                    id="shipping-heading2"
                    className="mt-4 text-lg font-medium text-gray-900"
                  >
                    Shipping address 2
                  </h2>

                  <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="adress2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="adress2"
                          name="adress2"
                          autoComplete="street-address"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={checkoutForm.adress2}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              adress2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="postalCode2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP / Postal code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="postalCode2"
                          name="postalCode2"
                          autoComplete="postal-code"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={checkoutForm.postalCode2}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              postalCode2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="apartment2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Apartment, House No#, etc.
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="apartment2"
                          name="apartment2"
                          autoComplete="address-line2"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={checkoutForm.apartment2}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              apartment2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="city2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="city2"
                          name="city2"
                          autoComplete="address-level2"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={checkoutForm.city2}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              city2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="country2"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Province
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="country2"
                          name="country2"
                          autoComplete="country-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          value={checkoutForm.country2}
                          onChange={(e) =>
                            setCheckoutForm({
                              ...checkoutForm,
                              country2: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>

            <section aria-labelledby="order-notice" className="mt-2">
              <div className="w-full h-1 border-2 mt-4" />
              <label
                htmlFor="orderNotice"
                className="block text-sm font-medium text-gray-700 mt-4"
              >
                Order Notice (Optional)
              </label>
              <div className="mt-1">
                <textarea
                  id="orderNotice"
                  name="orderNotice"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  value={checkoutForm.orderNotice}
                  onChange={(e) =>
                    setCheckoutForm({
                      ...checkoutForm,
                      orderNotice: e.target.value,
                    })
                  }
                />
              </div>
            </section>

            <button
              onClick={(e) => {
                e.preventDefault();
                makePurchase();
              }}
              type="submit"
              className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Place Order (Cash on Delivery)
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CheckoutPage;
