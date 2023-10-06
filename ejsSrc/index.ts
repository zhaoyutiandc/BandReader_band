import {main} from "./component.ejs";
import {createHomePage} from "./pages/home/home";
import {createHelpPage} from "./pages/help/help";
import {createAboutPage} from "./pages/about/about";
import {createListPage} from "./pages/list/list";
import {createConfigPage} from "./pages/config/config";
import {createReadPage} from "./pages/read/read";
import {eRender} from "./types/ERender";

// main()
(async () => {
    await eRender(await createHomePage({}))
    await eRender(await createHelpPage({}))
    await eRender(await createAboutPage({}))
    await eRender(await createListPage({}))
    await eRender(await createConfigPage({}))
    await eRender(await createReadPage({}))
})()