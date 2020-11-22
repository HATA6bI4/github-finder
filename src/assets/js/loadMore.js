export default function loadMore (res) {
    const repos_filter = [];

    if (res.length > 3) {
        for (let i = 0; i < 3; i++) {
            res[i].main = true
            repos_filter.push(res[i])
        }
        return repos_filter
    } else {
        for (let i = 0; i < res.length; i++) {
            res[i].main = true
            repos_filter.push(res[i])
        }
        return repos_filter
    }
}