import logger from './logger';

const SUB_PACKAGES = 'subPackages'.toLocaleLowerCase();

export default function getSubPackage(pages, {open, rules, publicRoot}) {
    if (!rules || rules.length === 0) {
        return {pages};
    }
    publicRoot = publicRoot || '';
    let result = {};
    if (!open) {
        result.pages = setALLPackage(pages, rules, publicRoot);
        return result;
    }
    // 预加载配置生成
    let preLoadRule = setPreLoadRule(pages, rules, publicRoot);
    preLoadRule && (result.preloadRule = preLoadRule);
    // 分包配置生成
    let subPackages = setSubPackage(pages, rules, publicRoot);
    subPackages.length > 0 && (result[SUB_PACKAGES] = subPackages);
    // 主包生成
    result.pages = setMasterPackage(pages, rules, publicRoot);

    // 检查是否有遗漏的路径，添加到主包中，并给出警告提示
    let subPageList = [].concat(result.pages);
    result[SUB_PACKAGES] && result[SUB_PACKAGES].forEach(sub => {
        subPageList = subPageList.concat(getPagesByPackage({
            pages,
            module: sub.name,
            publicRoot
        }));
    });

    let otherPage = pages.filter(page => subPageList.indexOf(page) == -1);
    if (otherPage.length > 0) {
        result.pages = result.pages.concat(otherPage);
        logger.log('subPackage', logger.colors.yellow('存在部分路径配置遗漏，已添加到主包中: '), otherPage);
    }
    return result;
}

function setMasterPackage(pages, rules, publicRoot) {
    let masterPackage = [];
    rules.forEach(rule => {
        if (rule.master) {
            masterPackage = masterPackage.concat(getPagesByPackage({
                pages,
                module: rule.module,
                publicRoot
            }));
        }
        if (rule.index && rule.master) {
            let index = masterPackage.indexOf(getPagePath({
                pages: masterPackage,
                module: rule.module,
                publicRoot,
                view: rule.index}));
            if (index !== -1) {
                let home = masterPackage.splice(index, 1)[0];
                masterPackage.unshift(home);
            }
        }
    });
    return masterPackage;
}

function setALLPackage(pages, rules, publicRoot) {
    let homePage;
    rules.forEach(rule => {
        if (rule.index && rule.master) {
            homePage  = getPagePath({
                pages,
                module: rule.module,
                publicRoot,
                view: rule.index
            });
        }
    });
    let index = pages.indexOf(homePage);
    if (index !== -1) {
        let home = pages.splice(index, 1)[0];
        pages.unshift(home);
    }
    return pages;
}

function setSubPackage(pages, rules, publicRoot) {
    let subPackages = [];
    rules.forEach(rule => {
        // 跳过主包配置
        if (rule.master) return;
        let nameList = subPackages.map(sub => sub.name);
        if (nameList.indexOf(rule.module) !== -1) {
            // 分包的名称不应该重复
            logger.log('subPackage', logger.colors.red(`${rule.module}分包名称重复`));
            return;
        }
        let rootDir = `${publicRoot}/${rule.module}`;
        subPackages.push({
            root: rootDir,
            name: rule.module,
            pages: getPagesByPackage({
                pages,
                module: rule.module,
                publicRoot
            }).map(page => {
                return page.replace(rootDir + '/', '');
            })
        });
    });
    return subPackages;
}

function setPreLoadRule(pages, rules, publicRoot) {
    let preLoadRule;
    rules.forEach(rule => {
        if (rule.preload) {
            preLoadRule = preLoadRule || {};
            Object.keys(rule.preload).forEach(preload => {
                let key = getPagePath({
                    pages,
                    module: rule.module,
                    publicRoot,
                    view: preload
                });
                let preRule = Array.isArray(rule.preload[preload]) ? rule.preload[preload] : [rule.preload[preload]];
                if (key) {
                    if (!preLoadRule[key]) {
                        preLoadRule[key] = {
                            packages: preRule
                        };
                    } else {
                        preLoadRule[key].packages = preLoadRule[key].packages.concat(preRule);
                    }
                } else {
                    logger.log('subPackage', logger.colors.red(`preLoadRule error:: module: ${rule.module}, view: ${preload}`));
                }
            });
        }
    });
    return preLoadRule;
}

/**
 * 根据 module 参数，从 列表中检索符合条件的路径
 * @param {object} args  pages: 页面路径集合，module： 包名， publicRoot：根目录
 * @return {array<string>}
 */
function getPagesByPackage({pages, module, publicRoot}) {
    let pattern = new RegExp(`^${publicRoot}/${module}`);
    return pages.filter(page => pattern.test(page));
}

/**
 * 返回符合条件的第一个页面路径
 * @param {object} args pages: 页面路径集合，module： 包名， publicRoot：根目录 view: 视图目录
 * @return {string}
 */
function getPagePath({pages, module, publicRoot, view}) {
    let pattern = new RegExp(`^${publicRoot}/${module}/views/${view}/(${view}|index)$`);
    return pages.find(page => pattern.test(page));
}
