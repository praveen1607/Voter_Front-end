const getStates = async () => {
  let response = [];
  try {
    await fetch("https://www.universal-tutorial.com/api/states/India", {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ0ZXN0ZXIuY29kZXIwNjAyQGdtYWlsLmNvbSIsImFwaV90b2tlbiI6InVEYWw5SlhaeElDUmFKSDFIc0tDbkhNb2lzRmlIN3oyWmZ3Y2FCQUVteFozYXAtSnktOXpPVzZHZUJTSmhpTXFEd0kifSwiZXhwIjoxNjE3NDExMzI5fQ.PF0hkvS6E6OU-TNx0Zy_hnCJ9VxTZLpfJRMQS_QqxhY",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        response = data;
      });
    // console.log(response);
  } catch (err) {
    console.log(err);
    response = [];
  }
  return response;
};

const getCities = async (stateName) => {
  let response = [];
  try {
    await fetch(`https://www.universal-tutorial.com/api/cities/${stateName}`, {
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfZW1haWwiOiJ0ZXN0ZXIuY29kZXIwNjAyQGdtYWlsLmNvbSIsImFwaV90b2tlbiI6InVEYWw5SlhaeElDUmFKSDFIc0tDbkhNb2lzRmlIN3oyWmZ3Y2FCQUVteFozYXAtSnktOXpPVzZHZUJTSmhpTXFEd0kifSwiZXhwIjoxNjE3NDExMzI5fQ.PF0hkvS6E6OU-TNx0Zy_hnCJ9VxTZLpfJRMQS_QqxhY",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        response = data;
      });
    // console.log(response);
  } catch (err) {
    console.log(err);
    response = [];
  }
  return response;
};

export { getStates, getCities };
