import Link from "next/link";

export default function RefundPolicy() {
    return (
        <div className="container text-white m-auto">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold my-3">Refund Policy</h1>

            <p className="pb-2">
                Thank you for shopping with us. We strive to ensure that you are satisfied with your purchase. <br /> However, we understand that there may be circumstances where you need to return a product.
            </p>
            

            <h5 className="font-bold">No Refund at the Moment:</h5> Currently, we do not offer refunds for purchases made through our store. All sales are final.

            <h5 className="font-bold">Exceptions:</h5> We may consider exceptions to this policy in unique cases. Please contact us within 3 days of receiving your order to report any issues.

            <h5 className="font-bold">Contact Us:</h5> If you have any questions or concerns about our refund policy, please contact us at <Link href={"/contact"} className="hover:text-cyan-400 transition-all">Contact Us</Link>.
        </div>
    )
}