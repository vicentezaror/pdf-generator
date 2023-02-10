import { IWorkDetail } from "../interfaces/IWorkDetail";

export default function calculateTotalPrice(details: IWorkDetail[]): number {
    return details.reduce((total, detail) => total + detail.price, 0);
}