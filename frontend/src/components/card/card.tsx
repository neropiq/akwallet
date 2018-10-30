import* as React from 'react';

interface Props {
    cards: any
}

interface cardProps {
    cardBackgroundClass: string; 
    cardTitle: string; 
    cardPriceClass: string;
    cardPrice: number;
}

class Card extends React.Component<Props> {
    render() {
        return(
            <div className="row state-cards">
                {
                    this.props.cards.map(({ cardBackgroundClass, cardTitle, cardPriceClass, cardPrice}: cardProps, index: number) => (
                        <div className="col-md-4" key={index}>
                            <div className="card bg-light-green pull-up black-shadow mb-4">
                                <div className="card-content">
                                    <div className={cardBackgroundClass}>
                                        <div className="card-title card-caption text-light-green">
                                            {cardTitle}
                                        </div>
                                        <div className={cardPriceClass}>
                                            <span>{cardPrice}</span> ADK
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default Card;