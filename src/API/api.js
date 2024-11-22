export const fetchShipmentData = async (trackingNumber) => {
  const API_URL = `https://tracking.bosta.co/shipments/track/${trackingNumber}`;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;

    // console.log(data);

    // // Extracting variables from the API response
    // const provider = data.provider;
    // const currentStatus = data.CurrentStatus;
    // const promisedDate = data.PromisedDate;
    // const trackingNumberData = data.TrackingNumber;
    // const trackingURL = data.TrackingURL;
    // const supportPhoneNumbers = data.SupportPhoneNumbers;
    // const transitEvents = data.TransitEvents;
    // const createDate = data.CreateDate;
    // const isEditableShipment = data.isEditableShipment;
    // const nextWorkingDay = data.nextWorkingDay;

    // return {
    //   provider,
    //   currentStatus,
    //   promisedDate,
    //   trackingNumber: trackingNumberData,
    //   trackingURL,
    //   supportPhoneNumbers,
    //   transitEvents,
    //   createDate,
    //   isEditableShipment,
    //   nextWorkingDay,
    // };
  } catch (error) {
    console.error("Error fetching shipment data:", error);
    throw error;
  }
};
