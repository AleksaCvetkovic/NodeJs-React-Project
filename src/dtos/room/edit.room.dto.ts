export class EditRoomDto{
    name: string;
    except: string;
    description: string;
    status: 'dostupna'|'nedostupna';
    price: string;
    features: {
        name:string;
        featureId:number;
    }[] | null;
}