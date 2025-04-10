const Forbidden = () => {
    return <>
        <div class="custom-bg text-dark">
            <div class="d-flex align-items-center justify-content-center min-vh-100 px-2">
                <div class="text-center">
                    <h1 class="display-1 fw-bold">403</h1>
                    <p class="fs-2 fw-medium mt-4">Forbidden!</p>
                    <p class="mt-4 mb-5">You do not have access to this page.</p>
                    <a href="/home" class="btn btn-light fw-semibold rounded-pill px-4 py-2 custom-btn">
                        Go Home
                    </a>
                </div>
            </div>
        </div>
    </>
}

export default Forbidden;