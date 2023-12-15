import React from "react";

export const Favorites_sAdmiTableHeader = () => {
    return (
        <section className="intro">
            <div className="h-100">
                <div className="mask d-flex align-items-center h-100">
                    <div className="container-favorites m-auto w-75">
                        <div className="row justify-content-center">
                            <div className="col-12">
                                <div className="card tableFavorites_sHeader text-center fs-4">
                                    <div className="card-body cardBodyBooks">
                                        <div className="table-responsive">
                                            <table className="table mb-0">
                                                <thead>
                                                    <tr>
                                                        <th scope="col" className="text-white text-center cell-size-favorites_s">F4V0R1T3S</th>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
