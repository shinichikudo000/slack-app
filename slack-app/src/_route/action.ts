import { API } from "@/_api/api";
import { redirect } from "react-router-dom";

export async function messageAction({ request, params }) {
    const formData = await request.formData();
    const values = Object.fromEntries(formData);
    if(values.message !== '') {
        try {
            const res = await API.post('/messages', {
                receiver_id: params.id,
                receiver_class: params.class,
                body: values.message
            })
            if (res.status === 200) {
                redirect(`/${params.class}/${params.id}`)
            } 
        } catch(error: any) {
            console.log(error)
            return error
        }
    }
    return
}