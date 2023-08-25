import axios from "axios";
import { useEffect, useState } from "react";

interface Category {
    cat_id: number;
    name: string;
    section: string;
}

export default function AddExpense(): JSX.Element {
    const [date, setDate] = useState<string>();
    const [payee, setPayee] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [amount, setAmount] = useState(0.0);
    const [flow, setFlow] = useState<"inflow" | "outflow">("outflow");

    const [categories, setCategories] = useState<Category[]>([]);

    const baseUrl =
        process.env.NODE_ENV === "production"
            ? "https://todo-server-476z.onrender.com"
            : "http://localhost:4000";

    useEffect(() => {
        const fetchCategories = async () => {
            const allCategories = await axios.get(`${baseUrl}/categories`);
            setCategories(allCategories.data);
        };
        fetchCategories();
    }, [baseUrl]);

    const handleDate = (date: string): void => {
        setDate(date);
    };

    const handlePayee = (payee: string): void => {
        setPayee(payee);
    };

    const handleCategory = (category: string): void => {
        setCategoryId(category);
    };

    const handleAmount = (amount: number): void => {
        setAmount(amount);
    };

    const handleSubmit = async (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLInputElement, MouseEvent>
    ) => {
        e.preventDefault();
        if (!payee || !categoryId || !amount) {
            return console.log("No");
        }

        try {
            const res = await axios.post(`${baseUrl}/expenses`, {
                payee,
                cat_id: categoryId,
                type: flow,
                amount,
            });
            console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    const handleFlow = () => {
        const newValue = flow === "inflow" ? "outflow" : "inflow";
        setFlow(newValue);
    };

    return (
        <>
            <form>
                <input
                    name="date"
                    type="date"
                    value={date}
                    onChange={(e) => handleDate(e.target.value)}
                ></input>
                <input
                    name="payee"
                    type="text"
                    placeholder="Payee..."
                    value={payee}
                    onChange={(e) => handlePayee(e.target.value)}
                ></input>
                <select
                    name="categories"
                    value={categoryId}
                    onChange={(e) => handleCategory(e.target.value)}
                >
                    <option disabled selected value="">
                        Select an option...
                    </option>
                    {categories.map((category) => (
                        <option key={category.cat_id} value={category.cat_id}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <input
                    name="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => handleAmount(Number(e.target.value))}
                    min="0"
                    step="any"
                ></input>
                <input
                    name="flow"
                    id="inflow"
                    type="radio"
                    value="inflow"
                    onChange={() => handleFlow()}
                ></input>
                <label htmlFor="inflow">Inflow</label>
                <input
                    name="flow"
                    id="outflow"
                    type="radio"
                    value="outflow"
                    onChange={() => handleFlow()}
                ></input>
                <label htmlFor="outflow">Outflow</label>
                <input
                    type="submit"
                    value="Submit"
                    onClick={(e) => handleSubmit(e)}
                ></input>
            </form>
        </>
    );
}
