const fetchOptions:globalThis.RequestInit = {
  "credentials": "include",
  "headers": {
    "User-Agent":
      "Mozilla/5.0 (X11; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-GB",
    "Sec-GPC": "1",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "If-None-Match": 'W/"21d666c4908f369badada56127b311f3"',
    "Priority": "u=0, i",
  },
  "method": "GET",
  "mode": "cors",
};

export { fetchOptions };
