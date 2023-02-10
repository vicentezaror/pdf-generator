import { IWorkshopCar } from "./IWorkshopCar";
import { IContact } from "./IContact";
import { IWorkDetail } from "./IWorkDetail";
import { IWorkshop } from "./IWorkshop";

export interface ITransaction {
    id: string;
    workshop: IWorkshop,
    workshopCar: IWorkshopCar,
    contact: IContact,
    details: IWorkDetail[],
}
