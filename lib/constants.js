import { PackId } from "./types";

export const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const CreditsPacks = {
  [PackId.SMALL]: {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "500 credits",
    credits: 500,
    price: 199,
  },
  [PackId.MEDIUM]: {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 299,
  },
  [PackId.LARGE]: {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 999,
  },
};

export const demoInitialFlow = {
  nodes: [
    {
      id: "3b92ead6-0c0e-4678-8258-48325b1f19e1",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "LAUNCH_BROWSER",
        inputs: {
          "Website Url": "https://quotes.toscrape.com/login",
        },
      },
      position: {
        x: 0,
        y: 150,
      },
      measured: {
        width: 420,
        height: 223,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "ec97aaeb-dc05-43b7-a181-1a09eca293f8",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "FILL_INPUT",
        inputs: {
          "Web page": "",
          Value: "Ujjwal",
          Selector: "#username",
        },
      },
      position: {
        x: 500,
        y: 50,
      },
      measured: {
        width: 420,
        height: 325,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "2ee5e4d9-2f97-4552-8cda-921bc8f5ee3c",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "FILL_INPUT",
        inputs: {
          "Web page": "",
          Selector: "#password",
          Value: "123456",
        },
      },
      position: {
        x: 1000,
        y: 50,
      },
      selected: false,
      measured: {
        width: 420,
        height: 325,
      },
      dragging: false,
    },
    {
      id: "f4899c1f-c390-455e-846c-1cb100ec03f8",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "CLICK_ELEMENT",
        inputs: {
          "Web page": "",
          Selector: "body > div > form > input.btn.btn-primary",
        },
      },
      position: {
        x: 1500,
        y: 50,
      },
      measured: {
        width: 420,
        height: 247,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "22387d13-f788-42f6-ae48-a3e8935fd40e",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "WAIT_FOR_ELEMENT",
        inputs: {
          "Web page": "",
          Selector: "body > div > div.row.header-box > div.col-md-4 > p > a",
          "Timeout (in ms)": "5000",
          Visibility: "visible",
        },
      },
      position: {
        x: 50,
        y: 500,
      },
      measured: {
        width: 420,
        height: 446,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "111a9037-d60b-4726-ba24-54b3281d7846",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "EXTRACT_TEXT_FROM_ELEMENT",
        inputs: {
          Html: "",
          Selector:
            "body > div > div:nth-child(2) > div.col-md-8 > div:nth-child(1) > span.text",
        },
      },
      position: {
        x: 1050,
        y: 550,
      },
      measured: {
        width: 420,
        height: 311,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "4391aca0-1513-4023-9598-d102e4d1952c",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "PAGE_TO_HTML",
        inputs: {
          "Web page": "",
        },
      },
      position: {
        x: 550,
        y: 550,
      },
      measured: {
        width: 420,
        height: 214,
      },
      selected: false,
      dragging: false,
    },
    {
      id: "3e6d9544-2fe4-4a16-a5b7-9a9dc31c5520",
      type: "ScrapelNode",
      dragHandle: ".drag-handle",
      data: {
        type: "DELIVER_VIA_WEBHOOK",
        inputs: {
          "Target Url": "https://httpbin.org/post",
          Body: "",
        },
      },
      position: {
        x: 1550,
        y: 600,
      },
      measured: {
        width: 420,
        height: 241,
      },
      selected: false,
      dragging: false,
    },
  ],
  edges: [
    {
      source: "3b92ead6-0c0e-4678-8258-48325b1f19e1",
      sourceHandle: "Web page",
      target: "ec97aaeb-dc05-43b7-a181-1a09eca293f8",
      targetHandle: "Web page",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__3b92ead6-0c0e-4678-8258-48325b1f19e1Web page-ec97aaeb-dc05-43b7-a181-1a09eca293f8Web page",
    },
    {
      source: "ec97aaeb-dc05-43b7-a181-1a09eca293f8",
      sourceHandle: "Web page",
      target: "2ee5e4d9-2f97-4552-8cda-921bc8f5ee3c",
      targetHandle: "Web page",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__ec97aaeb-dc05-43b7-a181-1a09eca293f8Web page-2ee5e4d9-2f97-4552-8cda-921bc8f5ee3cWeb page",
    },
    {
      source: "2ee5e4d9-2f97-4552-8cda-921bc8f5ee3c",
      sourceHandle: "Web page",
      target: "f4899c1f-c390-455e-846c-1cb100ec03f8",
      targetHandle: "Web page",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__2ee5e4d9-2f97-4552-8cda-921bc8f5ee3cWeb page-f4899c1f-c390-455e-846c-1cb100ec03f8Web page",
    },
    {
      source: "f4899c1f-c390-455e-846c-1cb100ec03f8",
      sourceHandle: "Web page",
      target: "22387d13-f788-42f6-ae48-a3e8935fd40e",
      targetHandle: "Web page",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__f4899c1f-c390-455e-846c-1cb100ec03f8Web page-22387d13-f788-42f6-ae48-a3e8935fd40eWeb page",
      selected: false,
    },
    {
      source: "22387d13-f788-42f6-ae48-a3e8935fd40e",
      sourceHandle: "Web page",
      target: "4391aca0-1513-4023-9598-d102e4d1952c",
      targetHandle: "Web page",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__22387d13-f788-42f6-ae48-a3e8935fd40eWeb page-4391aca0-1513-4023-9598-d102e4d1952cWeb page",
    },
    {
      source: "4391aca0-1513-4023-9598-d102e4d1952c",
      sourceHandle: "Html",
      target: "111a9037-d60b-4726-ba24-54b3281d7846",
      targetHandle: "Html",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__4391aca0-1513-4023-9598-d102e4d1952cHtml-111a9037-d60b-4726-ba24-54b3281d7846Html",
    },
    {
      source: "111a9037-d60b-4726-ba24-54b3281d7846",
      sourceHandle: "Extracted text",
      target: "3e6d9544-2fe4-4a16-a5b7-9a9dc31c5520",
      targetHandle: "Body",
      animated: true,
      markerEnd: {
        type: "arrowclosed",
      },
      id: "xy-edge__111a9037-d60b-4726-ba24-54b3281d7846Extracted text-3e6d9544-2fe4-4a16-a5b7-9a9dc31c5520Body",
    },
  ],
  viewport: {
    x: -33.5,
    y: 14,
    zoom: 0.5,
  },
};
