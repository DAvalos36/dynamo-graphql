import "dotenv/config";
import { client } from "./clientDynamo";

(async () => {
	try {
		const results = await client.listTables({});
		if (results.TableNames) {
			console.log(results.TableNames.join("\n"));
		}
	} catch (err) {
		console.error(err);
	}
})();
