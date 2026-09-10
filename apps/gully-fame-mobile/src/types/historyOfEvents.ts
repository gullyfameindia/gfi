export interface historyOfEvents {
    id: number;
    eventName: string;
    status: "Live" | "Upcoming" | "Completed";
    date: string;
    result: string;
}
