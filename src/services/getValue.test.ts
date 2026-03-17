import { getValue } from './context'
function testGetValue() {
    const context = {
        "transaction": {
            "amount": "12500",
            "country": "IL"
        }
    }

    const amount = getValue("amount", "$.transaction.amount", context);
    const country = getValue("country", "$.transaction.country", context);

    console.assert(amount === "12500", `Expected amount to be "12500", but got "${amount}"`);
    console.assert(country === "IL", `Expected country to be "IL", but got "${country}"`);

}

if (require.main === module) {
    testGetValue();
}
