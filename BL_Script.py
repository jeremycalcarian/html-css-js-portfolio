import numpy as np
import pandas as pd
import yfinance as yf
import streamlit as st
from scipy.optimize import minimize
import time

def get_market_data(tickers, start_date='2022-01-01', max_retries=3):
    valid_tickers = []
    data = {}
    
    for ticker in tickers:
        retries = 0
        while retries < max_retries:
            try:
                df = yf.download(ticker, start=start_date)['Adj Close']
                if not df.empty:
                    data[ticker] = df
                    valid_tickers.append(ticker)
                break  # Exit loop if successful
            except Exception as e:
                retries += 1
                time.sleep(2)  # Wait before retrying
                st.warning(f"Retry {retries}/{max_retries} for {ticker} due to error: {e}")
        
        if ticker not in valid_tickers:
            st.warning(f"Failed to fetch data for {ticker} after {max_retries} attempts.")
    
    if not data:
        st.error("No valid tickers found. Please check the symbols and try again.")
        return None, None
    
    df = pd.DataFrame(data)
    returns = df.pct_change().dropna()
    return returns, valid_tickers

def black_litterman(cov_matrix, market_weights, P, Q, Omega, risk_aversion=2.5):
    pi = risk_aversion * cov_matrix @ market_weights
    M = np.linalg.inv(Omega + P @ cov_matrix @ P.T)
    adj_return = P.T @ M @ (Q - P @ pi)
    return pi + adj_return

def optimize_portfolio(expected_returns, cov_matrix, risk_aversion=2.5):
    if expected_returns is None or cov_matrix is None:
        return None
    
    def objective(weights):
        return -((weights @ expected_returns) - 0.5 * risk_aversion * weights @ cov_matrix @ weights)
    
    constraints = ({'type': 'eq', 'fun': lambda w: np.sum(w) - 1})
    bounds = [(0, 1) for _ in range(len(expected_returns))]
    w0 = np.ones(len(expected_returns)) / len(expected_returns)
    result = minimize(objective, w0, bounds=bounds, constraints=constraints)
    return result.x if result.success else None

st.title("Black-Litterman Portfolio Optimizer")

# Predefined list of stock tickers for selection
available_tickers = ["AAPL", "MSFT", "GOOGL", "TSLA", "AMZN", "NVDA", "META", "BRK-B", "V", "JPM"]
tickers = st.multiselect("Select stocks for portfolio:", available_tickers, default=["AAPL", "MSFT", "GOOGL", "TSLA"])

market_data, valid_tickers = get_market_data(tickers)

if market_data is not None and valid_tickers:
    cov_matrix = market_data.cov()
    market_weights = np.ones(len(valid_tickers)) / len(valid_tickers)
    
    st.subheader("Investor Views")
    P = np.zeros((len(valid_tickers), len(valid_tickers)))
    Q = np.zeros(len(valid_tickers))
    Omega = np.identity(len(valid_tickers)) * 0.02
    
    for i, ticker in enumerate(valid_tickers):
        view = st.slider(f"Expected return for {ticker}", -0.1, 0.1, 0.02)
        P[i, i] = 1
        Q[i] = view
    
    expected_returns = black_litterman(cov_matrix, market_weights, P, Q, Omega)
    optimal_weights = optimize_portfolio(expected_returns, cov_matrix)
    
    if optimal_weights is not None:
        st.subheader("Optimized Portfolio Weights")
        result_df = pd.DataFrame({'Stock': valid_tickers, 'Optimal Weight': optimal_weights})
        st.dataframe(result_df.style.format({'Optimal Weight': '{:.2%}'}))
        st.line_chart(optimal_weights)
    else:
        st.error("Failed to compute optimized portfolio weights. Check input data.")